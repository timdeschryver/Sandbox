using Microsoft.AspNetCore.Antiforgery;
using Sandbox.SharedKernel.Logging;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed class ValidateAntiforgeryTokenRequestTransform(IAntiforgery antiforgery, ILogger<ValidateAntiforgeryTokenRequestTransform> logger) : RequestTransform
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

        logger.LogValidatingAntiforgeryToken(context.HttpContext.Request.Path.Value);

        try
        {
            await antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException ex)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            logger.LogAntiforgeryValidationFailed(ex, context.HttpContext.Request.Path.Value);
        }
    }
}
