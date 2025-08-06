using Microsoft.EntityFrameworkCore;
using Sandbox.SharedKernel.Infrastructure;

namespace Sandbox.Modules.Billing.Data;


public class BillingDbContext(DbContextOptions<BillingDbContext> options, TimeProvider timeProvider) : ModuleDbContext(options, timeProvider)
{
    public override string Schema => "Billing";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BillingDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
