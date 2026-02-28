using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.Billing.Application;
using Sandbox.Modules.Billing.Data;
using Sandbox.SharedKernel.FeatureFlags;
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
        {
            opt.UseNpgsql(builder.Configuration.GetConnectionString("sandbox-db"));
        });

        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);

        app.MapGroup("billing")
            .RequireAuthorization()
            .WithTags("Billing")
            .MapGet("", GetBillingOverview.Query)
                .WithName("GetBillingOverview")
                .WithDescription("Get billing overview")
                .WithFeatureFlag("billing-enabled");

        return app;
    }
}
