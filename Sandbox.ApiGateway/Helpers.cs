using System;

namespace Sandbox.ApiGateway;

internal static class Helpers
{
    public static string BuildRedirectUrl(HttpContext context, string? redirectUrl)
    {
        if (string.IsNullOrEmpty(redirectUrl))
        {
            redirectUrl = "/";
        }
        if (redirectUrl.StartsWith("/"))
        {
            redirectUrl = context.Request.Scheme + "://" + context.Request.Host + context.Request.PathBase + redirectUrl;
        }
        return redirectUrl;
    }
}
