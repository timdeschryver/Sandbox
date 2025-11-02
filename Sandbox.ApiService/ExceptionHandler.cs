using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Sandbox.ApiService;

internal sealed class ExceptionHandler(IProblemDetailsService problemDetailsService, IHostEnvironment environment) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(httpContext);
        ArgumentNullException.ThrowIfNull(exception);

        var statusCode = exception switch
        {
            BadHttpRequestException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        httpContext.Response.StatusCode = statusCode;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            Exception = exception,
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails
            {
                Status = statusCode,
                Detail = environment.IsDevelopment() ? exception.Message : null,
            }
        });
    }
}