using Microsoft.AspNetCore.Antiforgery;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed class AddAntiforgeryTokenResponseTransform(IAntiforgery antiforgery, ILogger<AddAntiforgeryTokenResponseTransform> logger) : ResponseTransform
{
    public override ValueTask ApplyAsync(ResponseTransformContext context)
    {
        if (!context.HttpContext.Request.RouteValues.ContainsKey("catch-all"))
        {
            return ValueTask.CompletedTask;
        }

        if (context.HttpContext.Response.ContentType?.Contains("text/html", StringComparison.Ordinal) != true)
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