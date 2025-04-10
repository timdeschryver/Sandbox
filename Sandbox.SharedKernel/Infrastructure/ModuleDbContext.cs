using Microsoft.EntityFrameworkCore;

namespace Sandbox.SharedKernel.Infrastructure;

public abstract class ModuleDbContext(DbContextOptions options) : DbContext(options)
{
    public abstract string Schema { get; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        base.OnModelCreating(modelBuilder);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.ApplyStronglyTypedIdEfConvertersFromAssembly(typeof(ModuleDbContext).Assembly);
        base.ConfigureConventions(configurationBuilder);
    }
}
