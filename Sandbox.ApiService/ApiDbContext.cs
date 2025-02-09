using Microsoft.EntityFrameworkCore;

namespace Sandbox.ApiService;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApiDbContext).Assembly);
    }
}