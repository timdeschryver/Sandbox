using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Data;

internal class CustomerAddressEntityConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        _ = builder.ToTable("customeraddresses");
        _ = builder.HasKey(p => p.Id);

        _ = builder.Property<CustomerId>("CustomerId")
            .HasVogenConversion()
            .IsRequired();

        _ = builder.ComplexProperty(p => p.Address, o =>
        {
            _ = o.Property(p => p.Street).HasMaxLength(255);
            _ = o.Property(p => p.City).HasMaxLength(100);
            _ = o.Property(p => p.ZipCode).HasMaxLength(20);
        });

        _ = builder.HasDiscriminator<string>("AddressType")
            .HasValue<CustomerBillingAddress>("Billing")
            .HasValue<CustomerShippingAddress>("Shipping");
    }
}
