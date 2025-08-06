using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class DeleteCustomer
{
    public sealed record Command([FromRoute] CustomerId CustomerId);

    /// <summary>
    /// Soft delete a customer by id.
    /// </summary>
    /// <returns>No content if successful, not found if customer doesn't exist.</returns>
    public static async Task<Results<NoContent, NotFound>> Handle(
        [AsParameters] Command command,
        [NotNull][FromServices] IDbContextOutbox<CustomerDbContext> outbox,
        CancellationToken cancellationToken)
    {
        var customer = await outbox.DbContext
            .Set<Customer>()
            .SingleOrDefaultAsync(c => c.Id == command.CustomerId, cancellationToken);

        if (customer is null)
        {
            return TypedResults.NotFound();
        }

        outbox.DbContext.Remove(customer);
        await outbox.SaveChangesAndFlushMessagesAsync(cancellationToken);

        return TypedResults.NoContent();
    }
}
