using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Data;

internal class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("CustomerAddresses");
        builder.HasKey(p => p.Id);
        builder.Property<int>("CustomerId").IsRequired();

        builder.ComplexProperty(p => p.Address, o =>
        {
            o.Property(p => p.Street).HasMaxLength(255);
            o.Property(p => p.City).HasMaxLength(100);
            o.Property(p => p.ZipCode).HasMaxLength(20);
        });

        builder.HasDiscriminator<string>("AddressType")
            .HasValue<CustomerBillingAddress>("Billing")
            .HasValue<CustomerShippingAddress>("Shipping");
    }
}
