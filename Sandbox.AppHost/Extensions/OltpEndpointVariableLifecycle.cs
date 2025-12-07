using Aspire.Hosting.Eventing;
using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Logging;

namespace Sandbox.AppHost.Extensions;

internal sealed class OltpEndpointVariableLifecycle(ILogger<OltpEndpointVariableLifecycle> logger) : IDistributedApplicationEventingSubscriber
{
    private const string OtelExporterOtlpEndpoint = "OTEL_EXPORTER_OTLP_ENDPOINT";

    public Task OnBeforeStartAsync(BeforeStartEvent @event, CancellationToken cancellationToken = default)
    {
        var collectorResource = @event.Model.Resources.OfType<OpenTelemetryCollectorResource>().FirstOrDefault();
        if (collectorResource == null)
        {
            logger.LogResourceNotFound(nameof(OpenTelemetryCollectorResource));
            return Task.CompletedTask;
        }

        var endpoint = collectorResource.GetEndpoint(OpenTelemetryCollectorResource.GRPCEndpointName);
        if (!endpoint.Exists)
        {
            logger.LogEndpointNotFound(OpenTelemetryCollectorResource.GRPCEndpointName);
            return Task.CompletedTask;
        }

        foreach (var resource in @event.Model.GetProjectResources())
        {
            resource.Annotations.Add(new EnvironmentCallbackAnnotation(context =>
            {
                if (context.EnvironmentVariables.ContainsKey(OtelExporterOtlpEndpoint))
                {
                    logger.LogForwardingTelemetry(resource.Name);
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