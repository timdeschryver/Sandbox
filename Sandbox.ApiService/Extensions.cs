namespace Sandbox.ApiService;

internal static class Extensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddErrorHandling()
        {
            services.AddExceptionHandler<ExceptionHandler>();
            services.AddProblemDetails(options =>
            {
                options.CustomizeProblemDetails = context =>
                {
                    context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
                };
            });
            return services;
        }
    }
}