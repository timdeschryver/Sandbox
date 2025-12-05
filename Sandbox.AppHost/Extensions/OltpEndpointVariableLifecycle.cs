using Aspire.Hosting.Eventing;
using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Logging;

namespace Sandbox.AppHost.Extensions;

internal sealed class OltpEndpointVariableLifecycle(ILogger<OltpEndpointVariableLifecycle> logger) : IDistributedApplicationEventingSubscriber
{
    private const string OtelExporterOtlpEndpoint = "OTEL_EXPORTER_OTLP_ENDPOINT";

    public Task OnBeforeStartAsync(BeforeStartEvent @event, CancellationToken cancellationToken = default)
    {
        var collectorResource = @event.Model.Resources.OfType<OpenTelemetryCollectorResource>().FirstOrDefault();
        if (collectorResource == null)
        {
            logger.LogWarning($"No {nameof(OpenTelemetryCollectorResource)} resource found.");
            return Task.CompletedTask;
        }

        var endpoint = collectorResource.GetEndpoint(OpenTelemetryCollectorResource.GRPCEndpointName);
        if (!endpoint.Exists)
        {
            logger.LogWarning($"No {OpenTelemetryCollectorResource.GRPCEndpointName} endpoint for the collector.");
            return Task.CompletedTask;
        }

        foreach (var resource in @event.Model.GetProjectResources())
        {
            resource.Annotations.Add(new EnvironmentCallbackAnnotation(context =>
            {
                if (context.EnvironmentVariables.ContainsKey(OtelExporterOtlpEndpoint))
                {
                    logger.LogDebug("Forwarding telemetry for {ResourceName} to the collector.", resource.Name);
                    context.EnvironmentVariables[OtelExporterOtlpEndpoint] = endpoint;
                }
            }));
        }

        return Task.CompletedTask;
    }


    public Task SubscribeAsync(IDistributedApplicationEventing eventing, DistributedApplicationExecutionContext executionContext, CancellationToken cancellationToken)
    {
        eventing.Subscribe<BeforeStartEvent>(OnBeforeStartAsync);
        return Task.CompletedTask;
    }
}