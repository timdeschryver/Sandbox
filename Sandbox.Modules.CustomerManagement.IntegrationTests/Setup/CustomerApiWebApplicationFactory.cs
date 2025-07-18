extern alias migrations;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Data;
using Testcontainers.PostgreSql;
using TUnit.Core.Interfaces;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public class CustomerApiWebApplicationFactory : WebApplicationFactory<Program>, IAsyncInitializer, IAsyncDisposable
{
    private readonly PostgreSqlContainer _postgreSqlContainer = new PostgreSqlBuilder().Build();

    public async Task InitializeAsync()
    {
        await _postgreSqlContainer.StartAsync();

        _ = Server;

        using var scope = Server.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        await _postgreSqlContainer.DisposeAsync();
        GC.SuppressFinalize(this);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        builder.UseSetting("ConnectionStrings:sandbox-db", _postgreSqlContainer.GetConnectionString());

        builder.ConfigureServices(services =>
        {
            services.AddAuthentication(defaultScheme: "Test")
                .AddScheme<AuthenticationSchemeOptions, CustomerApiAuthenticationHandler>("Test", options => { });

            services.AddDbContext<CustomerDbContext>(
                options =>
                    options.UseNpgsql(
                        _postgreSqlContainer.GetConnectionString(),
                        x => x.MigrationsAssembly(typeof(migrations.Program).Assembly.GetName().Name)
                )
            );
        });

        builder.UseEnvironment("IntegrationTest");
    }
}
