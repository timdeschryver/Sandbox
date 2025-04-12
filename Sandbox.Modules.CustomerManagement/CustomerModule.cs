using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Oakton.Resources;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Modules;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Http;
using Wolverine.Postgresql;

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

        builder.Services.AddWolverineHttp();
        builder.Host.UseWolverine(opts =>
        {
            var connectionString = builder.Configuration.GetConnectionString("sandbox-db") ?? throw new InvalidOperationException("Connection string 'sandbox-db' not found.");
            opts.PersistMessagesWithPostgresql(connectionString, "wolverine");
            opts.UseEntityFrameworkCoreTransactions();
            opts.MultipleHandlerBehavior = MultipleHandlerBehavior.Separated;
            opts.Durability.MessageIdentity = MessageIdentity.IdAndDestination;
            opts.Policies.UseDurableLocalQueues();
            opts.Policies.AutoApplyTransactions();
        })
        .UseResourceSetupOnStartup();

        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);

        app.MapWolverineEndpoints(opts =>
        {
            opts.RequireAuthorizeOnAll();
        });

        return app;
    }
}
