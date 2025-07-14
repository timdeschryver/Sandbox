using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Sandbox.Modules.Billing.Data;
using Sandbox.SharedKernel.Modules;
using Wolverine.Attributes;

[assembly: WolverineModule]
namespace Sandbox.Modules.Billing;

public class BillingModule : IModule
{
    public WebApplicationBuilder AddModule(WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        builder.AddNpgsqlDbContext<BillingDbContext>(connectionName: "sandbox-db", options =>
        {
            options.DisableRetry = true;
        });
        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);
        return app;
    }
}
