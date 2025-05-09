using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

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
        CancellationToken cancellationToken)
    {
        var result = await customers
            .Select(c => new Response(c.Id, c.Name.FirstName, c.Name.LastName))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(result);
    }
}
