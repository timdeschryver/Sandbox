using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;

namespace Sandbox.ApiGateway.Transformers;

internal class AddBearerTokenToHeadersTransform(ILogger<AddBearerTokenToHeadersTransform> logger) : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.User.Identity is not {IsAuthenticated: true})
        {
            return;
        }

        // This also handles token refreshes
        var accessToken = await context.HttpContext.GetUserAccessTokenAsync();
        if (accessToken.IsError)
        {
            logger.LogError("Could not get access token: {GetUserAccessTokenError} for request path: {RequestPath}. {Error}", accessToken.Error, context.HttpContext.Request.Path.Value, accessToken.Error);
            return;
        }

        logger.LogInformation("Adding bearer token to request headers for request path: {RequestPath}", context.HttpContext.Request.Path.Value);
        context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.AccessToken);
    }
}