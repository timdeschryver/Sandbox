using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Data;

internal class CustomerEntityConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        _ = builder.ToTable("customers");
        _ = builder.HasKey(p => p.Id);

        _ = builder.ComplexProperty(p => p.Name, o =>
        {
            _ = o.Property(p => p.FirstName).HasMaxLength(255);
            _ = o.Property(p => p.LastName).HasMaxLength(255);
        });
    }
}
