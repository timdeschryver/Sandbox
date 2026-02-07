using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class DeleteCustomer
{
    public sealed record Request([FromRoute] CustomerId CustomerId);

    /// <summary>
    /// Soft delete a customer by id.
    /// </summary>
    /// <returns>No content if successful, not found if customer doesn't exist.</returns>
    public static async Task<Results<NoContent, NotFound>> Handle(
        [AsParameters] Request request,
        [NotNull][FromServices] IDbContextOutbox<CustomerDbContext> outbox,
        CancellationToken cancellationToken)
    {
        var customer = await outbox.DbContext
            .Set<Customer>()
            .SingleOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

        if (customer is null)
        {
            return TypedResults.NotFound();
        }

        outbox.DbContext.Remove(customer);
        await outbox.PublishAsync(new CustomerDeleted(customer.Id));
        await outbox.SaveChangesAndFlushMessagesAsync(cancellationToken);

        return TypedResults.NoContent();
    }
}
