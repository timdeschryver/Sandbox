using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Respawn;
using Sandbox.Migrations;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.ServiceDefaults;
using StackExchange.Redis;
using ZiggyCreatures.Caching.Fusion;
using ZiggyCreatures.Caching.Fusion.Backplane.StackExchangeRedis;
using ZiggyCreatures.Caching.Fusion.Serialization.SystemTextJson;

// https://learn.microsoft.com/en-us/dotnet/aspire/database/ef-core-migrations
// https://github.com/dotnet/aspire-samples/blob/main/samples/AspireShop/AspireShop.CatalogDbManager/Program.cs

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();


builder.Services
    .AddFusionCache("Customers")
    .WithCacheKeyPrefixByCacheName()
    .WithDistributedCache(new RedisCache(new RedisCacheOptions() { Configuration = builder.Configuration.GetConnectionString("cache") }))
    .WithSerializer(new FusionCacheSystemTextJsonSerializer())
    .WithBackplane(new RedisBackplane(new RedisBackplaneOptions() { Configuration = builder.Configuration.GetConnectionString("cache") }))
    .AsKeyedHybridCacheByCacheName();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(DbInitializer.ActivitySourceName));
builder.Services.AddDbContext<CustomerDbContext>(
    optionsAction: options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("sandbox-db"), optionsBuilder =>
        {
            optionsBuilder.EnableRetryOnFailure();

            optionsBuilder.MigrationsAssembly(typeof(DbInitializer).Assembly.GetName().Name);
        });
    });

builder.Services.AddSingleton<DbInitializer>();
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddHealthChecks()
    .AddCheck<DbInitializerHealthCheck>("DbInitializer", null);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapPost("/reset-db", async (CustomerDbContext dbContext, DbInitializer dbInitializer, IFusionCacheProvider cacheProvider, CancellationToken cancellationToken) =>
    {
        await dbContext.Database.EnsureDeletedAsync(cancellationToken);
        await dbInitializer.InitializeDatabaseAsync(dbContext, cancellationToken);
        await ClearRedisCacheAsync(cacheProvider.GetCache("Customers"), cancellationToken);
    });

    app.MapPost("/reseed-db", async (CustomerDbContext dbContext, DbInitializer dbInitializer, IFusionCacheProvider cacheProvider, CancellationToken cancellationToken) =>
    {
        using var connection = dbContext.Database.GetDbConnection();
        await connection.OpenAsync(cancellationToken);
        var respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
        {
            SchemasToExclude = ["public"],
            DbAdapter = DbAdapter.Postgres
        });
        await respawner.ResetAsync(connection);
        await dbInitializer.InitializeDatabaseAsync(dbContext, cancellationToken);
        await ClearRedisCacheAsync(cacheProvider.GetCache("Customers"), cancellationToken);
    });
}

app.MapDefaultEndpoints();

await app.RunAsync();

static async Task ClearRedisCacheAsync(IFusionCache cache, CancellationToken cancellationToken)
{
    await cache.ClearAsync(false, token: cancellationToken);
}
