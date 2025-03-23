using Microsoft.AspNetCore.Antiforgery;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.ApiGateway.Transformers;

internal class ValidateAntiforgeryTokenRequestTransform(IAntiforgery antiforgery, ILogger<ValidateAntiforgeryTokenRequestTransform> logger) : RequestTransform
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

        logger.LogInformation("Validating antiforgery token for request path: {RequestPath}", context.HttpContext.Request.Path.Value);

        try
        {
            await antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException ex)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            logger.LogError(ex, "Antiforgery token validation failed for request path: {RequestPath}.", context.HttpContext.Request.Path.Value);
        }
    }
}