using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Sandbox.ApiService.CustomerModule.Endpoints;

internal static class GetCustomers
{
    internal static IEndpointRouteBuilder MapGetCustomers(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("", async (
                [FromServices] ApiDbContext dbContext,
                CancellationToken cancellationToken
            ) =>
            {
                var customers = await dbContext.Set<Customer>()
                    .Select(c => new GetCustomersResponse(c.Id, c.Name.FirstName, c.Name.LastName))
                    .ToListAsync(cancellationToken);

                return TypedResults.Ok(customers);
            });

        return endpoints;
    }
}

public record GetCustomersResponse(int Id, string FirstName, string LastName);
