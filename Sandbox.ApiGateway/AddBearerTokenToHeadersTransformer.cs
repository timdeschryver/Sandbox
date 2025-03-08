using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;

internal class AddBearerTokenToHeadersTransformer : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.User.Identity?.IsAuthenticated ?? false)
        {
            var accessToken = await context.HttpContext.GetTokenAsync("access_token");
            context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
    }
}