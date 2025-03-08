using Microsoft.Net.Http.Headers;

namespace Sandbox.ApiGateway;

internal static class ApplicationBuilderExtensions
{
    // Thanks Damien https://github.com/damienbod/bff-auth0-aspnetcore-angular/blob/main/server/Services/ApplicationBuilderExtensions.cs#L7
    public static IApplicationBuilder UseNoUnauthorizedRedirect(this IApplicationBuilder applicationBuilder, params string[] segments)
    {
        applicationBuilder.Use(async (httpContext, func) =>
        {
            if (segments.Any(s => httpContext.Request.Path.StartsWithSegments(s)))
            {
                httpContext.Request.Headers[HeaderNames.XRequestedWith] = "XMLHttpRequest";
            }

            await func();
        });

        return applicationBuilder;
    }
}
