using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Modules;
using Wolverine.Attributes;

[assembly: WolverineModule]
namespace Sandbox.Modules.CustomerManagement;

public class CustomerManagementModule : IModule
{
    public WebApplicationBuilder AddModule(WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        // Uncomment to use SQL Server instead of PostgreSQL
        // builder.AddSqlServerDbContext<CustomerDbContext>(connectionName: "sandbox-db");
        builder.AddNpgsqlDbContext<CustomerDbContext>(connectionName: "sandbox-db", options =>
        {
            // Conflicts with Wolverine's transaction management
            options.DisableRetry = true;
        });

        builder.Services.AddTransient(sp => sp.GetRequiredService<CustomerDbContext>().Set<Customer>().AsNoTracking());
        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);


        return app;
    }
}
