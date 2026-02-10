extern alias migrations;

using ApiServiceSDK;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Kiota.Abstractions.Authentication;
using Microsoft.Kiota.Http.HttpClientLibrary;
using Sandbox.Modules.CustomerManagement.Data;
using TUnit.Core.Interfaces;
using TUnit.AspNetCore;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public class CustomerApiWebApplicationFactory : TestWebApplicationFactory<Program>, IAsyncInitializer, IAsyncDisposable
{
    [ClassDataSource<DatabaseContainer>(Shared = SharedType.PerTestSession)]
    public DatabaseContainer Database { get; init; } = null!;

    [ClassDataSource<CacheContainer>(Shared = SharedType.PerTestSession)]
    public CacheContainer Cache { get; init; } = null!;

    public async Task InitializeAsync()
    {
        _ = Server;

        using var scope = Server.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        builder.UseSetting("ConnectionStrings:sandbox-db", Database.Container.GetConnectionString());
        builder.UseSetting("ConnectionStrings:cache", Cache.Container.GetConnectionString());

        builder.ConfigureServices(services =>
        {
            services.AddAuthentication(defaultScheme: "Test")
                .AddScheme<AuthenticationSchemeOptions, CustomerApiAuthenticationHandler>("Test", options => { });

            services.AddDbContext<CustomerDbContext>(
                options =>
                    options.UseNpgsql(
                        Database.Container.GetConnectionString(),
                        x => x.MigrationsAssembly(typeof(migrations.Program).Assembly)
                )
            );
        });

        builder.UseEnvironment("IntegrationTest");
    }

    [After(HookType.Test)]
    public async Task CleanupTable()
    {
        using var scope = Server.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();

        var customers = await dbContext.Set<Customer>().ToListAsync();
        dbContext.Set<Customer>().RemoveRange(customers);
    }

    public static ApiClient CreateApiClient(HttpClient httpClient)
    {
        var authProvider = new AnonymousAuthenticationProvider();
        using var adapter = new HttpClientRequestAdapter(authProvider, httpClient: httpClient);
        return new ApiClient(adapter);
    }
}
