using Microsoft.AspNetCore.Mvc;

namespace Sandbox.ApiService.CustomerModule.Endpoints;

public record CreateCustomerCommand(string? FirstName, string? LastName, CreateCustomerCommandBillingAddress? BillingAddress, CreateCustomerCommandShippingAddress? ShippingAddress);
public record CreateCustomerCommandBillingAddress(string? Street, string? City, string? ZipCode);
public record CreateCustomerCommandShippingAddress(string? Street, string? City, string? ZipCode, string? Note);

internal static class CreateCustomer
{
    internal static IEndpointRouteBuilder MapCreateCustomer(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("",
            async (
                [FromBody] CreateCustomerCommand request,
                [FromServices] ApiDbContext dbContext,
                CancellationToken cancellationToken
            ) =>
            {
                var customer = new Customer(FullName.From(request.FirstName, request.LastName));
                if (request.BillingAddress != null)
                {
                    var billingAddress = Address.From(request.BillingAddress.Street, request.BillingAddress.City, request.BillingAddress.ZipCode);
                    customer.AddBillingAddress(new CustomerBillingAddress(billingAddress));
                }
                if (request.ShippingAddress != null)
                {
                    var shippingAddress = Address.From(request.ShippingAddress.Street, request.ShippingAddress.City, request.ShippingAddress.ZipCode);
                    customer.AddShippingAddress(new CustomerShippingAddress(shippingAddress, request.ShippingAddress.Note ?? string.Empty));
                }

                await dbContext.AddAsync(customer, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);

                return TypedResults.Created();
            });

        return endpoints;
    }
}

