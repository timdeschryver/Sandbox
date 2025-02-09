using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Sandbox.ApiService.Migrations;

internal class DbInitializerHealthCheck(DbInitializer dbInitializer) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken)
    {
        var task = dbInitializer.ExecuteTask;
        return task switch
        {
            null => Task.FromResult(HealthCheckResult.Healthy()),
            { IsCompletedSuccessfully: true } => Task.FromResult(HealthCheckResult.Healthy()),
            { IsFaulted: true } => Task.FromResult(HealthCheckResult.Unhealthy(task.Exception?.InnerException?.Message, task.Exception)),
            { IsCanceled: true } => Task.FromResult(HealthCheckResult.Unhealthy("Database initialization was canceled")),
            _ => Task.FromResult(HealthCheckResult.Degraded("Database initialization is still in progress"))
        };
    }
}
