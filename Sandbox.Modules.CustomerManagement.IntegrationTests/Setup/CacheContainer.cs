extern alias migrations;
using Testcontainers.Redis;
using TUnit.Core.Interfaces;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public class CacheContainer : IAsyncInitializer, IAsyncDisposable
{
    public RedisContainer Container { get; } = new RedisBuilder("redis:7.0").Build();

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
