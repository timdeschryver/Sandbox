using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Logging;

namespace Sandbox.AppHost.Extensions;

public class OltpEndpointVariableHook(ILogger<OltpEndpointVariableHook> logger) : IDistributedApplicationLifecycleHook
{
    public Task AfterEndpointsAllocatedAsync(DistributedApplicationModel appModel, CancellationToken cancellationToken)
    {
        var collectorResource = appModel.Resources.OfType<CollectorResource>().FirstOrDefault();
        if (collectorResource == null)
        {
            logger.LogWarning("No collector resource found");
            return Task.CompletedTask;
        }

        var grpcEndpoint = collectorResource.GRPCEndpoint;

        foreach (var resourceItem in appModel.GetProjectResources())
        {
            logger.LogDebug($"Forwarding Telemetry for {resourceItem.Name} to the collector");
            resourceItem.Annotations.Add(new EnvironmentCallbackAnnotation((context) =>
            {
                context.EnvironmentVariables["OTEL_EXPORTER_OTLP_ENDPOINT"] = grpcEndpoint;
            }));
            logger.LogDebug($"Forwarding Telemetry for {resourceItem.Name} to the collector");
        }

        return Task.CompletedTask;
    }
}