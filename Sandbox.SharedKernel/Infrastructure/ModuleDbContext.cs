using Microsoft.EntityFrameworkCore;
using Sandbox.SharedKernel.Domain;
using System.Reflection;

namespace Sandbox.SharedKernel.Infrastructure;

public abstract class ModuleDbContext(DbContextOptions options, TimeProvider timeProvider) : DbContext(options)
{
    private static readonly MethodInfo SetGlobalQueryForSoftDeleteMethod =
        typeof(ModuleDbContext).GetMethod(nameof(SetGlobalQueryForSoftDelete), BindingFlags.NonPublic | BindingFlags.Static)!;

    public abstract string Schema { get; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        ArgumentNullException.ThrowIfNull(optionsBuilder);
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.AddInterceptors(new SoftDeleteInterceptor(timeProvider));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema(Schema);
        ConfigureSoftDeleteQueryFilters(modelBuilder);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.ApplyStronglyTypedIdEfConvertersFromAssembly(typeof(ModuleDbContext).Assembly);
        base.ConfigureConventions(configurationBuilder);
    }

    /// <summary>
    /// Configures global query filters to automatically exclude soft deleted entities.
    /// </summary>
    private void ConfigureSoftDeleteQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
            {
                var method = SetGlobalQueryForSoftDeleteMethod.MakeGenericMethod(entityType.ClrType);
                method.Invoke(this, [modelBuilder]);
            }
        }
    }

    private static void SetGlobalQueryForSoftDelete<T>(ModelBuilder modelBuilder) where T : class, ISoftDelete
    {
        // TODO: Add named query filter EF 10
        // modelBuilder.Entity<T>().HasQueryFilter("SoftDeletionFilter", e => e.DeletedAt == null);
        modelBuilder.Entity<T>().HasQueryFilter(e => e.DeletedAt == null);
    }
}
