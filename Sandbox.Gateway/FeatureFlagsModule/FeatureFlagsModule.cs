using Microsoft.AspNetCore.Mvc;
using OpenFeature;
using Sandbox.SharedKernel.FeatureFlags;

namespace Sandbox.Gateway.FeatureFlagsModule;

internal static class FeatureFlagsModule
{
    internal static IEndpointRouteBuilder MapFeatureFlagEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapGet(
            "feature-flags",
            async ([FromServices] IFeatureClient featureClient) =>
            {
                var flags = new List<FeatureFlag>();
                foreach (var flagKey in FeatureFlagKeys.All)
                {
                    var enabled = await featureClient.GetBooleanValueAsync(flagKey, false);
                    flags.Add(new FeatureFlag(flagKey, enabled));
                }

                return TypedResults.Ok(flags);
            });

        return builder;
    }
}
