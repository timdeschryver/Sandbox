using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class GetCustomer
{
    public sealed record Request([FromRoute] CustomerId CustomerId);
    public sealed record Response(CustomerId Id, string FirstName, string LastName, ReadOnlyCollection<ResponseBillingAddress> BillingAddresses, ReadOnlyCollection<ResponseShippingAddress> ShippingAddresses);
    public sealed record ResponseBillingAddress(CustomerAddressId Id, string Street, string City, string ZipCode);
    public sealed record ResponseShippingAddress(CustomerAddressId Id, string Street, string City, string ZipCode, string Note);

    /// <summary>
    /// Get a customer by id.
    /// </summary>
    /// <returns>The requested customer.</returns>
    public static async Task<Results<Ok<Response>, NotFound>> Query(
       [AsParameters] Request request,
       [FromServices] IQueryable<Customer> customers,
       CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var customer = await customers
            .Select(c => new Response(
                c.Id,
                c.Name.FirstName,
                c.Name.LastName,
                new ReadOnlyCollection<ResponseBillingAddress>(c.BillingAddresses.Select(b => new ResponseBillingAddress(b.Id, b.Address.Street, b.Address.City, b.Address.ZipCode)).ToList()),
                new ReadOnlyCollection<ResponseShippingAddress>(c.ShippingAddresses.Select(s => new ResponseShippingAddress(s.Id, s.Address.Street, s.Address.City, s.Address.ZipCode, s.Note)).ToList())
            )
            {
                Id = c.Id,
            })
            .AsSplitQuery()
            .SingleOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

        return customer switch
        {
            null => TypedResults.NotFound(),
            _ => TypedResults.Ok(customer),
        };
    }
}
