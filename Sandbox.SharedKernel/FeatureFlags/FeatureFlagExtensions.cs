using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenFeature;
using OpenFeature.Contrib.Hooks.Otel;
using OpenFeature.Hooks;
using OpenFeature.Providers.Memory;

namespace Sandbox.SharedKernel.FeatureFlags;

public static class FeatureFlagExtensions
{
    private const string ConfigSection = "FeatureFlags";

    /// <summary>
    /// Register OpenFeature with the official in-memory provider.
    /// Call once from API and Gateway startup.
    /// Flag definitions are read from the <c>FeatureFlags</c> configuration section.
    /// </summary>
    public static WebApplicationBuilder AddFeatureFlags(this WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        var definitions = builder.Configuration.GetSection(ConfigSection).Get<List<FeatureFlagDefinition>>() ?? [];

        _ = builder.Services.AddOpenFeature(featureBuilder =>
        {
            _ = featureBuilder.AddContext((contextBuilder, sp) =>
            {
                _ = contextBuilder.Set("environment", builder.Environment.EnvironmentName);
            });
            _ = featureBuilder.AddHook(new TracingHook());
            _ = featureBuilder.AddHook(new OpenFeature.Hooks.MetricsHook());
            _ = featureBuilder.AddHook(sp => new LoggingHook(sp.GetRequiredService<ILogger<LoggingHook>>()));
            _ = featureBuilder.AddProvider(_ => new InMemoryProvider(BuildFlags(definitions)));
        });

        _ = builder.Services.AddSingleton<IReadOnlyList<FeatureFlagDefinition>>(definitions);

        return builder;
    }

    private static Dictionary<string, Flag> BuildFlags(List<FeatureFlagDefinition> definitions)
    {
        var variants = new Dictionary<string, bool> { { "on", true }, { "off", false } };
        var flags = new Dictionary<string, Flag>(StringComparer.OrdinalIgnoreCase);
        foreach (var def in definitions)
        {
            flags[def.Key] = new Flag<bool>(variants, def.Enabled ? "on" : "off");
        }

        return flags;
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
