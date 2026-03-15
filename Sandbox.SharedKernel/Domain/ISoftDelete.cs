using System.Diagnostics.CodeAnalysis;

namespace Sandbox.SharedKernel.Domain;

/// <summary>
/// Interface for entities that support soft delete functionality.
/// </summary>
public interface ISoftDelete
{
    /// <summary>
    /// Indicates whether the entity is deleted (soft deleted).
    /// </summary>
    bool IsDeleted => DeletedAt.HasValue;

    /// <summary>
    /// The timestamp when the entity was deleted.
    /// </summary>
    DateTimeOffset? DeletedAt { get; set; }

    /// <summary>
    /// Marks the entity as deleted.
    /// </summary>
    void Delete([NotNull] TimeProvider timeProvider)
    {
        DeletedAt = timeProvider.GetUtcNow();
    }

    /// <summary>
    /// Undoes the soft delete by resetting the deletion flags.
    /// </summary>
    void Undo()
    {
        DeletedAt = null;
    }
}
