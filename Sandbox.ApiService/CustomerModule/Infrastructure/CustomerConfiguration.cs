using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sandbox.ApiService.CustomerModule.Infrastructure;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers", schema: "customer");
        builder.HasKey(p => p.Id);

        builder.ComplexProperty(p => p.Name, o =>
        {
            o.Property(p => p.FirstName).HasMaxLength(255);
            o.Property(p => p.LastName).HasMaxLength(255);
        });
    }
}
