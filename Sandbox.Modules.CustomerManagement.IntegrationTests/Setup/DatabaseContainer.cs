extern alias migrations;
using Testcontainers.PostgreSql;
using TUnit.Core.Interfaces;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public class DatabaseContainer : IAsyncInitializer, IAsyncDisposable
{
    public PostgreSqlContainer Container { get; } = new PostgreSqlBuilder("postgres:17.6")
        .Build();

    public async Task InitializeAsync()
    {
        await Container.StartAsync();
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);
        await Container.DisposeAsync();
    }
}
