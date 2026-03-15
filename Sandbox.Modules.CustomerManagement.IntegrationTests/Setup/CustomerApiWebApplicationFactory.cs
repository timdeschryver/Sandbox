extern alias migrations;
using ApiServiceSDK;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Kiota.Abstractions.Authentication;
using Microsoft.Kiota.Http.HttpClientLibrary;
using OpenFeature.Hosting;
using Sandbox.Modules.CustomerManagement.Data;
using TUnit.AspNetCore;
using TUnit.Core.Interfaces;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public class CustomerApiWebApplicationFactory : TestWebApplicationFactory<Program>, IAsyncInitializer
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

            // Remove OpenFeature's lifecycle service to prevent teardown errors
            // when the static Api singleton is shut down multiple times across tests.
            var openFeatureLifecycle = services.FirstOrDefault(
                d => d.ImplementationType == typeof(HostedFeatureLifecycleService));
            if (openFeatureLifecycle is not null)
            {
                services.Remove(openFeatureLifecycle);
            }
        });

        builder.UseEnvironment("IntegrationTest");
    }

    public static ApiClient CreateApiClient(HttpClient httpClient)
    {
        var authProvider = new AnonymousAuthenticationProvider();
        using var adapter = new HttpClientRequestAdapter(authProvider, httpClient: httpClient);
        return new ApiClient(adapter);
    }
}
