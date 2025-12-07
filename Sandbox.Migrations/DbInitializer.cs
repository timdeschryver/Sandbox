using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Logging;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Migrations;

internal class DbInitializer(IServiceProvider serviceProvider, ILogger<DbInitializer> logger) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";

    private readonly ActivitySource _activitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var customerDbContext = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();

        using var activity = _activitySource.StartActivity("Initializing database", ActivityKind.Client);
        await InitializeDatabaseAsync(customerDbContext, cancellationToken);
    }

    public async Task InitializeDatabaseAsync(DbContext dbContext, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(dbContext.Database.MigrateAsync, cancellationToken);

        await SeedAsync(dbContext, cancellationToken);

        logger.LogDatabaseInitializationCompleted(sw.ElapsedMilliseconds);
    }

    private async Task SeedAsync(DbContext dbContext, CancellationToken cancellationToken)
    {
        logger.LogSeedingDatabase();

        await SeedCustomers(dbContext, cancellationToken);
    }

    private static async Task SeedCustomers(DbContext dbContext, CancellationToken cancellationToken)
    {
        if (!dbContext.Set<Customer>().Any())
        {
            var customers = new[]
            {
                Customer.Create(CustomerId.New(), new FullName("Alice", "Smith")),
                Customer.Create(CustomerId.New(), new FullName("Bob", "Johnson")),
                Customer.Create(CustomerId.New(), new FullName("Charlie", "Brown")),
            };

            await dbContext.Set<Customer>().AddRangeAsync(customers, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}