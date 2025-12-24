using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography;
using Sandbox.Modules.CustomerManagement.Data;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class GetCustomers
{
    public sealed record Parameters();
    public sealed record Response(CustomerId Id, string FirstName, string LastName);

    /// <summary>
    /// Get all customers.
    /// </summary>
    /// <returns>A collection with all customers.</returns>
    public static async Task<Ok<List<Response>>> Query(
        [AsParameters] Parameters parameters,
        [FromServices] IQueryable<Customer> customers,
        [FromKeyedServices("Customers")] HybridCache cache,
        CancellationToken cancellationToken)
    {
        var result = await cache.GetOrCreateCustomersAsync(
            async ct =>
            {
                await Task.Delay(RandomNumberGenerator.GetInt32(0, 1000), ct);
                return await customers
                    .Select(c => new Response(c.Id, c.Name.FirstName, c.Name.LastName))
                    .ToListAsync(ct);
            },
            cancellationToken);

        return TypedResults.Ok(result);
    }
}
