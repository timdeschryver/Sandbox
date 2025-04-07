using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Application;

internal static class GetCustomers
{
    internal sealed record Query();
    internal sealed record Response(int Id, string FirstName, string LastName);

    internal static async Task<Ok<List<Response>>> Get(
        [AsParameters] Query query,
        [FromServices] IQueryable<Customer> customers,
        CancellationToken cancellationToken)
    {
        var result = await customers
            .Select(c => new Response(c.Id, c.Name.FirstName, c.Name.LastName))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(result);
    }
}
