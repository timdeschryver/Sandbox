using Aspire.Hosting.Lifecycle;
using Microsoft.Extensions.Configuration;

namespace Sandbox.AppHost.Extensions;

public static class OpenTelemetryCollectorExtensions
{
    private const string DashboardOtlpUrlVariableName = "DOTNET_DASHBOARD_OTLP_ENDPOINT_URL";

    /// <summary>
    /// Adds the OpenTelemetry Collector to the application.
    /// Inspired by Glenn Versweyveld https://github.com/Depechie/OpenTelemetryGrafana/tree/aspire
    /// Inspired by Martin Thwaites https://github.com/practical-otel/opentelemetry-aspire-collector/tree/main
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    public static IResourceBuilder<CollectorResource> AddOpenTelemetryCollector(this IDistributedApplicationBuilder builder)
    {
        var collectorResource = new CollectorResource("otelcollector");
        var otel = builder
            .AddResource(collectorResource)
            .WithImage("otel/opentelemetry-collector-contrib", "latest")
            .WithEndpoint(port: 4317, targetPort: 4317, name: "grpc", scheme: "http")
            .WithEndpoint(port: 4318, targetPort: 4318, name: "http", scheme: "http")
            .WithBindMount("../config/otel.yml", "/etc/otelcol-contrib/config.yaml")
            .WithEnvironment("ASPIRE_OTLP_ENDPOINT", ReplaceLocalhostWithContainerHost(builder.Configuration[DashboardOtlpUrlVariableName], builder.Configuration))
            .WithEnvironment("ASPIRE_API_KEY", builder.Configuration["AppHost:OtlpApiKey"]);

        otel.ApplicationBuilder.Services.TryAddLifecycleHook<OltpEndpointVariableHook>();

        return otel;
    }

    private static string ReplaceLocalhostWithContainerHost(string? value, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(value, nameof(value));
        var hostName = configuration["AppHost:ContainerHostname"] ?? "host.docker.internal";
        return value.Replace("localhost", hostName, StringComparison.OrdinalIgnoreCase)
            .Replace("127.0.0.1", hostName)
            .Replace("[::1]", hostName);
    }
}