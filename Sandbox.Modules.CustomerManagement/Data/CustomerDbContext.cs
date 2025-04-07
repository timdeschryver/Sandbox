using Microsoft.EntityFrameworkCore;
using Sandbox.SharedKernel.Infrastructure;

namespace Sandbox.Modules.CustomerManagement.Data;

internal class CustomerDbContext(DbContextOptions options) : ModuleDbContext(options)
{
    public override string Schema => "CustomerManagement";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CustomerDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}