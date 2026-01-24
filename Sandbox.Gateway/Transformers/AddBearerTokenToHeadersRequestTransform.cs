using System.Net.Http.Headers;
using Duende.AccessTokenManagement.OpenIdConnect;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed partial class AddBearerTokenToHeadersTransform(ILogger<AddBearerTokenToHeadersTransform> logger) : RequestTransform
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
            LogAccessTokenFailed(logger, accessToken.FailedResult.Error, context.HttpContext.Request.Path.Value, accessToken.FailedResult.ErrorDescription);
            return;
        }

        LogAddingBearerToken(logger, context.HttpContext.Request.Path.Value);
        context.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Token.AccessToken);
    }

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Adding bearer token to request headers for request path: {RequestPath}")]
    private static partial void LogAddingBearerToken(
        ILogger logger,
        string? requestPath);

    [LoggerMessage(
        Level = LogLevel.Error,
        Message = "Could not get access token: {GetUserAccessTokenError} for request path: {RequestPath}. {Error}")]
    private static partial void LogAccessTokenFailed(
        ILogger logger,
        string? getUserAccessTokenError,
        string? requestPath,
        string? error);
}
