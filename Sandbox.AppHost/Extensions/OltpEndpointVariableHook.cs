using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Logging;

namespace Sandbox.AppHost.Extensions;

public class OltpEndpointVariableHook(ILogger<OltpEndpointVariableHook> logger) : IDistributedApplicationLifecycleHook
{
    private const string OtelExporterOtlpEndpoint = "OTEL_EXPORTER_OTLP_ENDPOINT";

    public Task AfterEndpointsAllocatedAsync(DistributedApplicationModel appModel, CancellationToken cancellationToken)
    {
        var collectorResource = appModel.Resources.OfType<OpenTelemetryCollectorResource>().FirstOrDefault();
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

        foreach (var resource in appModel.GetProjectResources())
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
}