using Microsoft.EntityFrameworkCore;

namespace Sandbox.ApiService.CustomerModule.Endpoints;

public static class CustomerEndpoints
{
    public static RouteGroupBuilder MapCustomerEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("", GetCustomers);
        builder.MapGet("{id}", GetCustomer);
        builder.MapPost("", CreateCustomer);
        builder.RequireAuthorization();
        return builder;
    }

    public static async Task<IResult> GetCustomers(ApiDbContext dbContext, CancellationToken cancellationToken)
    {
        var customers = await dbContext.Set<Customer>()
            .Include(p => p.BillingAddresses)
            .Include(p => p.ShippingAddresses)
            .ToListAsync(cancellationToken);
        return TypedResults.Ok(customers);
    }

    public static async Task<IResult> GetCustomer(int id, ApiDbContext dbContext, CancellationToken cancellationToken)
    {
        var customer = await dbContext.Set<Customer>()
            .Include(p => p.BillingAddresses)
            .Include(p => p.ShippingAddresses)
            .SingleOrDefaultAsync(p => p.Id == id, cancellationToken);

        return customer switch
        {
            null => TypedResults.NotFound(),
            _ => TypedResults.Ok(customer),
        };
    }

    public static async Task<IResult> CreateCustomer(CreateCustomerCommand command, ApiDbContext dbContext, CancellationToken cancellationToken)
    {
        var customer = new Customer(Name.From(command.FirstName, command.LastName));
        if (command.ShippingAddress != null)
        {
            customer.AddShippingAddress(new CustomerShippingAddress(Address.From(command.ShippingAddress.Street, command.ShippingAddress.City, command.ShippingAddress.ZipCode), command.ShippingAddress.Note));
        }
        if (command.BillingAddress != null)
        {
            customer.AddBillingAddress(new CustomerBillingAddress(Address.From(command.BillingAddress.Street, command.BillingAddress.City, command.BillingAddress.ZipCode)));
        }

        await dbContext.AddAsync(customer, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.Created();
    }
}

public record BillingAddressDto(string Street, string City, string ZipCode);
public record ShippingAddressDto(string Street, string City, string ZipCode, string? Note);
public record CreateCustomerCommand(string FirstName, string LastName, BillingAddressDto? BillingAddress, ShippingAddressDto? ShippingAddress);
