using Microsoft.AspNetCore.Antiforgery;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed partial class ValidateAntiforgeryTokenRequestTransform(IAntiforgery antiforgery, ILogger<ValidateAntiforgeryTokenRequestTransform> logger) : RequestTransform
{
    public override async ValueTask ApplyAsync(RequestTransformContext context)
    {
        if (context.HttpContext.Request.Method == HttpMethod.Get.Method ||
            context.HttpContext.Request.Method == HttpMethod.Head.Method ||
            context.HttpContext.Request.Method == HttpMethod.Options.Method ||
            context.HttpContext.Request.Method == HttpMethod.Trace.Method)
        {
            return;
        }

        if (context.HttpContext.Request.Headers.ContentType.Contains("application/x-protobuf"))
        {
            return;
        }

        LogValidatingAntiforgeryToken(logger, context.HttpContext.Request.Path.Value);

        try
        {
            await antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException ex)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            LogAntiforgeryValidationFailed(logger, ex, context.HttpContext.Request.Path.Value);
        }
    }

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Validating antiforgery token for request path: {RequestPath}")]
    private static partial void LogValidatingAntiforgeryToken(
        ILogger logger,
        string? requestPath);

    [LoggerMessage(
        Level = LogLevel.Error,
        Message = "Antiforgery token validation failed for request path: {RequestPath}")]
    private static partial void LogAntiforgeryValidationFailed(
        ILogger logger,
        Exception ex,
        string? requestPath);
}
