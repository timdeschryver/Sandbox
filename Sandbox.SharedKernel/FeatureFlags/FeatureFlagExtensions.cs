using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenFeature;
using OpenFeature.Contrib.Hooks.Otel;
using OpenFeature.DependencyInjection.Providers.Flagd;
using OpenFeature.Hooks;

namespace Sandbox.SharedKernel.FeatureFlags;

public static class FeatureFlagExtensions
{
    private const string FlagdConnectionName = "flagd";

    /// <summary>
    /// Register OpenFeature with the flagd provider.
    /// Call once from API and Gateway startup.
    /// </summary>
    public static WebApplicationBuilder AddFeatureFlags(this WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        var flagdConnectionString = builder.Configuration.GetConnectionString(FlagdConnectionName);

        builder.Services.AddOpenFeature(featureBuilder =>
        {
            featureBuilder.AddContext((contextBuilder, sp) =>
            {
                contextBuilder.Set("environment", builder.Environment.EnvironmentName);
            });
            featureBuilder.AddHook(new TracingHook());
            featureBuilder.AddHook(new OpenFeature.Hooks.MetricsHook());
            featureBuilder.AddHook(sp => new LoggingHook(sp.GetRequiredService<ILogger<LoggingHook>>()));

            if (string.IsNullOrWhiteSpace(flagdConnectionString))
            {
                featureBuilder.AddFlagdProvider();
                return;
            }

            var flagdUri = new Uri(flagdConnectionString);
            featureBuilder.AddFlagdProvider(options =>
            {
                options.Host = flagdUri.Host;
                options.Port = flagdUri.Port;
                options.UseTls = string.Equals(flagdUri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase);
            });
        });

        return builder;
    }

    /// <summary>
    /// Adds a <see cref="FeatureFlagEndpointFilter"/> to the route that returns 404 when the flag is disabled.
    /// </summary>
    public static RouteHandlerBuilder WithFeatureFlag(this RouteHandlerBuilder builder, string flagKey)
    {
        ArgumentNullException.ThrowIfNull(builder);
        return builder.AddEndpointFilter((context, next) => new FeatureFlagEndpointFilter(flagKey).InvokeAsync(context, next));
    }
}
