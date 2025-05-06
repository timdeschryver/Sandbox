using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway.Transformers;

internal sealed class AddSecurityHeadersResponseTransform(IConfiguration configuration, ILogger<AddSecurityHeadersResponseTransform> logger) : ResponseTransform
{
    private readonly ILogger<AddSecurityHeadersResponseTransform> _logger = logger;
    private readonly string _cspPolicy = configuration["ContentSecurityPolicy:Policy"]!;

    public override ValueTask ApplyAsync(ResponseTransformContext context)
    {
        if (context.HttpContext.Response.ContentType?.Contains("text/html", StringComparison.Ordinal) == true)
        {
            _logger.LogInformation("Adding security headers to response for path: {RequestPath}", context.HttpContext.Request.Path.Value);
            context.HttpContext.Response.Headers.Append("Content-Security-Policy", _cspPolicy);
            context.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            context.HttpContext.Response.Headers.Append("X-Frame-Options", "DENY");
            context.HttpContext.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
            context.HttpContext.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            context.HttpContext.Response.Headers.Append("Permissions-Policy", "geolocation=()");
            context.HttpContext.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000;");
        }

        return ValueTask.CompletedTask;
    }
}
