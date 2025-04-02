using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Sandbox.ApiService.CustomerModule.Endpoints;

public record GetCustomerResponse(int Id, string FirstName, string LastName, IEnumerable<GetCustomerResponseBillingAddress> BillingAddresses, IEnumerable<GetCustomerResponseShippingAddress> ShippingAddresses);
public record GetCustomerResponseBillingAddress(int Id, string Street, string City, string ZipCode);
public record GetCustomerResponseShippingAddress(int Id, string Street, string City, string ZipCode, string Note);

internal static class GetCustomer
{
    internal static IEndpointRouteBuilder MapGetCustomer(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("{id}", async Task<Results<Ok<GetCustomerResponse>, NotFound>> (
                [FromRoute] int id,
                [FromServices] ApiDbContext dbContext,
                CancellationToken cancellationToken
            ) =>
            {
                var customer = await dbContext.Set<Customer>()
                    .Select(c => new GetCustomerResponse(
                        c.Id,
                        c.Name.FirstName,
                        c.Name.LastName,
                        c.BillingAddresses.Select(b => new GetCustomerResponseBillingAddress(b.Id, b.Address.Street, b.Address.City, b.Address.ZipCode)),
                        c.ShippingAddresses.Select(s => new GetCustomerResponseShippingAddress(s.Id, s.Address.Street, s.Address.City, s.Address.ZipCode, s.Note))
                    )
                    {
                        Id = c.Id,
                    })
                    .SingleOrDefaultAsync(c => c.Id == id, cancellationToken);

                return customer switch
                {
                    { } => TypedResults.Ok(customer),
                    null => TypedResults.NotFound(),
                };
            });

        return endpoints;
    }
}
