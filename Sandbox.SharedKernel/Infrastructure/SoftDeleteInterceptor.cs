using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Sandbox.SharedKernel.Domain;

namespace Sandbox.SharedKernel.Infrastructure;

/// <summary>
/// EF Core interceptor that automatically handles soft delete operations.
/// When an entity implementing ISoftDelete is deleted, it will be marked as deleted
/// instead of being physically removed from the database.
/// </summary>
public class SoftDeleteInterceptor(TimeProvider timeProvider) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(eventData);

        if (eventData.Context is null)
        {
            return ValueTask.FromResult(result);
        }

        foreach (var entry in eventData.Context.ChangeTracker.Entries())
        {
            if (entry is not { State: EntityState.Deleted, Entity: ISoftDelete entity })
            {
                continue;
            }

            entry.State = EntityState.Modified;
            entity.Delete(timeProvider);
        }

        return ValueTask.FromResult(result);
    }
}
