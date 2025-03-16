using Microsoft.AspNetCore.Mvc;

namespace Sandbox.ApiService.CustomerModule.Endpoints;

internal static class CreateCustomer
{
    internal static IEndpointRouteBuilder MapCreateCustomer(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("",
            async (
                [FromBody] CreateCustomerRequest request,
                [FromServices] ApiDbContext dbContext,
                CancellationToken cancellationToken
            ) =>
            {
                var customer = Customer.New(
                    Name.From(request.FirstName, request.LastName),
                    request.BillingAddress == null ? null : new CustomerBillingAddress(Address.From(request.BillingAddress.Street, request.BillingAddress.City, request.BillingAddress.ZipCode)),
                    request.ShippingAddress == null ? null : new CustomerShippingAddress(Address.From(request.ShippingAddress.Street, request.ShippingAddress.City, request.ShippingAddress.ZipCode), request.ShippingAddress.Note)
                );

                await dbContext.AddAsync(customer, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);

                return TypedResults.Created();
            });

        return endpoints;
    }
}

public record CreateCustomerRequest(string? FirstName, string? LastName, BillingAddressRequest? BillingAddress, ShippingAddressRequest? ShippingAddress);
public record BillingAddressRequest(string? Street, string? City, string? ZipCode);
public record ShippingAddressRequest(string? Street, string? City, string? ZipCode, string? Note);
