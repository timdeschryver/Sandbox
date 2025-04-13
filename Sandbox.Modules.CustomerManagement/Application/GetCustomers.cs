using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.Http;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class GetCustomers
{
    public sealed record Response(CustomerId Id, string FirstName, string LastName);

    [WolverineGet("/customers")]
    public static async Task<Ok<List<Response>>> Get(
        [FromServices] IQueryable<Customer> customers,
        CancellationToken cancellationToken)
    {
        var result = await customers
            .Select(c => new Response(c.Id, c.Name.FirstName, c.Name.LastName))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(result);
    }
}
