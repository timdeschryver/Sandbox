using Microsoft.AspNetCore.Mvc;
using Sandbox.SharedKernel.FeatureFlags;

namespace Sandbox.Gateway.FeatureFlagsModule;

internal static class FeatureFlagsModule
{
    internal static IEndpointRouteBuilder MapFeatureFlagEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("feature-flags", ([FromServices] IReadOnlyList<FeatureFlagDefinition> definitions) =>
        {
            IReadOnlyList<FeatureFlag> flags = definitions
                .Where(d => d.FrontendVisible)
                .Select(d => new FeatureFlag(d.Key, d.Enabled))
                .ToList()
                .AsReadOnly();
            return TypedResults.Ok(flags);
        });

        return builder;
    }
}
