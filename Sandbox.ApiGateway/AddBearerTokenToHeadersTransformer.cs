using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;

internal class AddBearerTokenToHeadersTransformer(ILogger<AddBearerTokenToHeadersTransformer> logger) : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.User.Identity?.IsAuthenticated ?? false)
        {
            // This also handles token refreshes
            var accessToken = await context.HttpContext.GetUserAccessTokenAsync();
            if (accessToken.IsError)
            {
                logger.LogError("Could not get access token: {GetUserAccessTokenError}", accessToken.Error);
                return;
            }
            context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.AccessToken);
        }
    }
}