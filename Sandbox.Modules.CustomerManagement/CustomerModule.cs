using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.CustomerManagement.Application;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Modules;
using Wolverine.Attributes;
using ZiggyCreatures.Caching.Fusion;

[assembly: WolverineModule]
namespace Sandbox.Modules.CustomerManagement;

public class CustomerManagementModule : IModule
{
    public WebApplicationBuilder AddModule(WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        _ = builder.Services.AddValidation();
        _ = builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow;
        });

        _ = builder.Services.AddDbContext<CustomerDbContext>(opt =>
        {
            _ = opt.UseNpgsql(builder.Configuration.GetConnectionString("sandbox-db"));
        });

        _ = builder.Services.AddTransient(sp => sp.GetRequiredService<CustomerDbContext>().Set<Customer>().AsNoTracking());

        _ = builder.Services.AddFusionCache("Customers")
            .TryWithAutoSetup()
            .WithCacheKeyPrefixByCacheName()
            .AsKeyedHybridCacheByCacheName();

        return builder;
    }

    public WebApplication UseModule(WebApplication app)
    {
        ArgumentNullException.ThrowIfNull(app);
        var group = app.MapGroup("customers")
            .RequireAuthorization()
            .WithTags("Customer Management");
        _ = group.MapGet("", GetCustomers.Query)
            .WithName("GetCustomers")
            .WithDescription("Get all customers");
        _ = group.MapGet("{customerId}", GetCustomer.Query)
            .WithName("GetCustomer")
            .WithDescription("Get a customer by ID");
        _ = group.MapPost("", CreateCustomer.Handle)
            .WithName("CreateCustomer")
            .WithDescription("Create a new customer");
        _ = group.MapDelete("{customerId}", DeleteCustomer.Handle)
            .WithName("DeleteCustomer")
            .WithDescription("Delete a customer by ID");
        return app;
    }
}
