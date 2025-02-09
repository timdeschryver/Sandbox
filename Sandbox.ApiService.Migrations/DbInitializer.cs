using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace Sandbox.ApiService.Migrations;

internal class DbInitializer(IServiceProvider serviceProvider, ILogger<DbInitializer> logger) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";

    private readonly ActivitySource _activitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

        using var activity = _activitySource.StartActivity("Initializing database", ActivityKind.Client);
        await InitializeDatabaseAsync(dbContext, cancellationToken);
    }

    public async Task InitializeDatabaseAsync(ApiDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(dbContext.Database.MigrateAsync, cancellationToken);

        await SeedAsync(dbContext, cancellationToken);

        logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms", sw.ElapsedMilliseconds);
    }

    private async Task SeedAsync(ApiDbContext dbContext, CancellationToken cancellationToken)
    {
        logger.LogInformation("Seeding database");

        if (!dbContext.Set<Person>().Any())
        {
            var people = new[]
            {
                new Person ("Alice", "Smith", "alicesmith@example.com", new DateTime(1996, 5, 10)),
                new Person ("Bob", "Johnson", "bobjohnson@example.com", new DateTime(1988, 8, 11)),
                new Person ("Charlie", "Williams", "charliewilliams@example.com", new DateTime(1992, 11, 3)),
            };
            await dbContext.Set<Person>().AddRangeAsync(people, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}