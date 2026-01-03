using System.Net.Http.Headers;
using Duende.AccessTokenManagement.OpenIdConnect;
using Sandbox.SharedKernel.Logging;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed class AddBearerTokenToHeadersTransform(ILogger<AddBearerTokenToHeadersTransform> logger) : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.User.Identity is not { IsAuthenticated: true })
        {
            return;
        }

        // This also handles token refreshes
        var accessToken = await context.HttpContext.GetUserAccessTokenAsync();
        if (!accessToken.Succeeded)
        {
            logger.LogAccessTokenFailed(accessToken.FailedResult.Error, context.HttpContext.Request.Path.Value, accessToken.FailedResult.ErrorDescription);
            return;
        }

        logger.LogAddingBearerToken(context.HttpContext.Request.Path.Value);
        context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Token.AccessToken);
    }
}
