using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Sandbox.Modules.CustomerManagement.Application;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Modules;

namespace Sandbox.Modules.CustomerManagement;

public class CustomerManagementModule : IModule
{
    public WebApplicationBuilder AddModule(WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        // Uncomment to use SQL Server instead of PostgreSQL
        // builder.AddSqlServerDbContext<CustomerDbContext>(connectionName: "sandbox-db");
        builder.AddNpgsqlDbContext<CustomerDbContext>(connectionName: "sandbox-db");

        builder.Services.AddTransient(sp => sp.GetRequiredService<CustomerDbContext>().Set<Customer>().AsNoTracking());
        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);

        var endpoints = app.MapGroup("/customers").RequireAuthorization();
        endpoints.MapPost("", CreateCustomer.Handle);
        endpoints.MapGet("", GetCustomers.Get);
        endpoints.MapGet("{id}", GetCustomer.Get);

        return app;
    }
}
