using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Sandbox.ApiService.CustomerModule;

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

        await SeedCustomers(dbContext, cancellationToken);
    }

    private static async Task SeedCustomers(ApiDbContext dbContext, CancellationToken cancellationToken)
    {
        if (!dbContext.Set<Customer>().Any())
        {
            var customers = new[]
            {
                Customer.New(new Name("Alice", "Smith")),
                Customer.New(
                    new Name("Bob", "Johnson"),
                    new CustomerBillingAddress(Address.From("123 Main Street", "Seattle", "WA 98101"))
                ),
                Customer.New(
                    new Name("Charlie", "Brown"),
                    new CustomerBillingAddress(Address.From("456 Oak Avenue", "Portland", "OR 97201")),
                    new CustomerShippingAddress(Address.From("789 Pine Road", "Portland", "OR 97202"), "Leave at front door")
                )
            };

            await dbContext.Set<Customer>().AddRangeAsync(customers, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}