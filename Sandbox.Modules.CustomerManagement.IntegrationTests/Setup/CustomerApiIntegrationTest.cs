using TUnit.AspNetCore;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;

public abstract class CustomerApiIntegrationTest : WebApplicationTest<CustomerApiWebApplicationFactory, Program>, IAsyncDisposable
{
    private string? _databaseName;
    private string? _databaseConnectionString;

    protected override async Task SetupAsync()
    {
        _databaseName = GetIsolatedName("Sandbox");
        _databaseConnectionString = await GlobalFactory.CreateIsolatedDatabaseAsync(_databaseName);
    }

    protected override void ConfigureWebHostBuilder(IWebHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        builder.UseSetting("ConnectionStrings:sandbox-db", _databaseConnectionString);
    }

    protected override void ConfigureTestConfiguration(IConfigurationBuilder config)
    {
        ArgumentNullException.ThrowIfNull(config);

        config.AddInMemoryCollection(
            new Dictionary<string, string?>
            {
                ["ConnectionStrings:sandbox-db"] = _databaseConnectionString,
            });
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);

        if (_databaseName is not null)
        {
            await GlobalFactory.DropIsolatedDatabaseAsync(_databaseName);
        }
    }
}
