using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sandbox.ApiService.CustomerModule.Infrastructure;

public class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("CustomerAddresses", schema: "customer");
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
