using Microsoft.EntityFrameworkCore;
using Sandbox.ApiService;
using Sandbox.ApiService.Migrations;

// https://learn.microsoft.com/en-us/dotnet/aspire/database/ef-core-migrations
// https://github.com/dotnet/aspire-samples/blob/main/samples/AspireShop/AspireShop.CatalogDbManager/Program.cs

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(DbInitializer.ActivitySourceName));

builder.AddSqlServerDbContext<ApiDbContext>(connectionName: "database", configureDbContextOptions: options => {
     options.UseSqlServer(optionsBuilder => {
            optionsBuilder.MigrationsAssembly(typeof(Program).Assembly.GetName().Name);
     });
});
builder.Services.AddSingleton<DbInitializer>();
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddHealthChecks()
    .AddCheck<DbInitializerHealthCheck>("DbInitializer", null);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapPost("/reset-db", async (ApiDbContext dbContext, DbInitializer dbInitializer, CancellationToken cancellationToken) =>
    {
        await dbContext.Database.EnsureDeletedAsync(cancellationToken);
        await dbInitializer.InitializeDatabaseAsync(dbContext, cancellationToken);
    });
}

app.MapDefaultEndpoints();

await app.RunAsync();
