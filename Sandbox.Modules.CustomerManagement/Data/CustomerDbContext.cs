using Microsoft.EntityFrameworkCore;
using Sandbox.SharedKernel.Infrastructure;

namespace Sandbox.Modules.CustomerManagement.Data;

public class CustomerDbContext(DbContextOptions<CustomerDbContext> options, TimeProvider timeProvider) : ModuleDbContext(options, timeProvider)
{
    public override string Schema => "customermanagement";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CustomerDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
