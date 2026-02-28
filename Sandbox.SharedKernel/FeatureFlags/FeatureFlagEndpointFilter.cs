using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using OpenFeature;

namespace Sandbox.SharedKernel.FeatureFlags;

/// <summary>
/// An endpoint filter that gates access based on an OpenFeature boolean flag.
/// Returns 404 Not Found when the flag is disabled.
/// </summary>
public sealed class FeatureFlagEndpointFilter(string flagKey) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        var featureClient = context.HttpContext.RequestServices.GetRequiredService<IFeatureClient>();

        var isEnabled = await featureClient.GetBooleanValueAsync(flagKey, false);
        if (!isEnabled)
        {
            return Results.NotFound();
        }

        return await next(context);
    }
}
