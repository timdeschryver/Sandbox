using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class DeleteCustomer
{
    /// <summary>
    /// Delete an existing customer.
    /// </summary>
    /// <returns>No content if successful.</returns>
    public static async Task<Results<NoContent, NotFound>> Handle(
        CustomerId customerId,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(customerId);
        ArgumentNullException.ThrowIfNull(httpContext);

        // TODO: Should be injected, but this is a workaround for https://github.com/dotnet/aspnetcore/issues/61388
        var outbox = httpContext.RequestServices.GetRequiredService<IDbContextOutbox<CustomerDbContext>>();
        ArgumentNullException.ThrowIfNull(outbox);

        var customer = await outbox.DbContext.Set<Domain.Customer>()
            .FirstOrDefaultAsync(c => c.Id == customerId, cancellationToken);

        if (customer == null)
        {
            return TypedResults.NotFound();
        }

        outbox.DbContext.Remove(customer);
        await outbox.SaveChangesAndFlushMessagesAsync(cancellationToken);

        return TypedResults.NoContent();
    }
}