using Aspire.Hosting.Eventing;
using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Logging;

namespace Sandbox.AppHost.Extensions;

internal sealed partial class OltpEndpointVariableLifecycle(ILogger<OltpEndpointVariableLifecycle> logger) : IDistributedApplicationEventingSubscriber
{
    private const string OtelExporterOtlpEndpoint = "OTEL_EXPORTER_OTLP_ENDPOINT";

    public Task OnBeforeStartAsync(BeforeStartEvent @event, CancellationToken cancellationToken = default)
    {
        var collectorResource = @event.Model.Resources.OfType<OpenTelemetryCollectorResource>().FirstOrDefault();
        if (collectorResource == null)
        {
            LogResourceNotFound(logger, nameof(OpenTelemetryCollectorResource));
            return Task.CompletedTask;
        }

        var endpoint = collectorResource.GetEndpoint(OpenTelemetryCollectorResource.GRPCEndpointName);
        if (!endpoint.Exists)
        {
            LogEndpointNotFound(logger, OpenTelemetryCollectorResource.GRPCEndpointName);
            return Task.CompletedTask;
        }

        foreach (var resource in @event.Model.GetProjectResources())
        {
            resource.Annotations.Add(new EnvironmentCallbackAnnotation(context =>
            {
                if (context.EnvironmentVariables.ContainsKey(OtelExporterOtlpEndpoint))
                {
                    LogForwardingTelemetry(logger, resource.Name);
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

    [LoggerMessage(
        Level = LogLevel.Debug,
        Message = "Forwarding telemetry for {ResourceName} to the collector")]
    private static partial void LogForwardingTelemetry(
        ILogger logger,
        string resourceName);

    [LoggerMessage(
        Level = LogLevel.Warning,
        Message = "No {ResourceType} resource found")]
    private static partial void LogResourceNotFound(
        ILogger logger,
        string resourceType);

    [LoggerMessage(
        Level = LogLevel.Warning,
        Message = "No {EndpointName} endpoint for the collector")]
    private static partial void LogEndpointNotFound(
        ILogger logger,
        string endpointName);
}
