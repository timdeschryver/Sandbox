using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.Http;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class GetCustomer
{
    public sealed record Response(CustomerId Id, string FirstName, string LastName, IEnumerable<BillingAddress> BillingAddresses, IEnumerable<ShippingAddress> ShippingAddresses);
    public sealed record BillingAddress(CustomerAddressId Id, string Street, string City, string ZipCode);
    public sealed record ShippingAddress(CustomerAddressId Id, string Street, string City, string ZipCode, string Note);

    [WolverineGet("/customers/{customerId}")]
    public static async Task<Results<Ok<Response>, NotFound>> Get(
       int customerId,
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
            .AsSplitQuery()
            .SingleOrDefaultAsync(c => c.Id == new CustomerId(customerId), cancellationToken);

        return customer switch
        {
            null => TypedResults.NotFound(),
            _ => TypedResults.Ok(customer),
        };
    }
}
