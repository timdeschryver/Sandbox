using Microsoft.AspNetCore.Antiforgery;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

#pragma warning disable CA1812
internal sealed class AddAntiforgeryTokenResponseTransform(IAntiforgery antiforgery, ILogger<AddAntiforgeryTokenResponseTransform> logger) : ResponseTransform
#pragma warning restore CA1812
{
    public override ValueTask ApplyAsync(ResponseTransformContext context)
    {
        if (!context.HttpContext.Request.RouteValues.ContainsKey("catch-all"))
        {
            return ValueTask.CompletedTask;
        }

        var tokenSet = antiforgery.GetAndStoreTokens(context.HttpContext);
        ArgumentNullException.ThrowIfNull(tokenSet.RequestToken);
        context.HttpContext.Response.Cookies.Append("__Sandbox-X-XSRF-TOKEN", tokenSet.RequestToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            SameSite = SameSiteMode.Strict,
        });
        logger.LogInformation("XSRF token added to response for request path: {RequestPath}", context.HttpContext.Request.Path.Value);
        return ValueTask.CompletedTask;
    }
}