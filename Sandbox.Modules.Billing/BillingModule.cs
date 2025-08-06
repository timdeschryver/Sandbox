using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

        builder.Services.AddDbContext<BillingDbContext>(opt =>
            opt.UseNpgsql(builder.Configuration.GetConnectionString("sandbox-db")));
        builder.EnrichSqlServerDbContext<BillingDbContext>(configureSettings =>
        {
            configureSettings.DisableRetry = true;
        });

        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);
        return app;
    }
}
