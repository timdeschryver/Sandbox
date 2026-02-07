using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class GetCustomers
{
    public sealed record Request();
    public sealed record Response(CustomerId Id, string FirstName, string LastName);

    /// <summary>
    /// Get all customers.
    /// </summary>
    /// <returns>A collection with all customers.</returns>
    public static async Task<Ok<List<Response>>> Query(
        [AsParameters] Request _,
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
