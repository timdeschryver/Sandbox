using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Application;

internal static class GetCustomer
{
    internal sealed record Query(int Id);
    internal sealed record Response(int Id, string FirstName, string LastName, IEnumerable<BillingAddress> BillingAddresses, IEnumerable<ShippingAddress> ShippingAddresses);
    internal sealed record BillingAddress(int Id, string Street, string City, string ZipCode);
    internal sealed record ShippingAddress(int Id, string Street, string City, string ZipCode, string Note);

    internal static async Task<Results<Ok<Response>, NotFound>> Get(
        [AsParameters] Query query,
        [FromServices] IQueryable<Customer> customers,
        CancellationToken cancellationToken)
    {
        var customer = await customers
            .Select(c => new Response(
                c.Id,
                c.Name.FirstName,
                c.Name.LastName,
                c.BillingAddresses.Select(b => new BillingAddress(b.Id, b.Address.Street, b.Address.City, b.Address.ZipCode)),
                c.ShippingAddresses.Select(s => new ShippingAddress(s.Id, s.Address.Street, s.Address.City, s.Address.ZipCode, s.Note))
            )
            {
                Id = c.Id,
            })
            .SingleOrDefaultAsync(c => c.Id == query.Id, cancellationToken);

        return customer switch
        {
            null => TypedResults.NotFound(),
            _ => TypedResults.Ok(customer),
        };
    }
}
