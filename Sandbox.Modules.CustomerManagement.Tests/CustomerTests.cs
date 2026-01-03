using Microsoft.Extensions.Time.Testing;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Tests;

public sealed class CustomerTests
{
    [Test]
    public async Task Customer_is_created_with_billing_and_shipping_address()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));

        await Assert.That(customer.Name.ToString()).IsEqualTo("John Doe");
    }

    [Test]
    public async Task Customer_billing_address_is_added()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));
        customer.AddBillingAddress(CustomerBillingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001")));

        await Assert.That(customer.BillingAddresses)
            .Count()
            .IsEqualTo(1);

        await Assert.That(customer.BillingAddresses)
            .Satisfies(addresses => addresses is not null && addresses.All(a => a.Type == "Billing"));
    }

    [Test]
    public async Task Customer_does_not_add_duplicate_billing_address()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));
        customer.AddBillingAddress(CustomerBillingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001")));
        customer.AddBillingAddress(CustomerBillingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001")));

        await Assert.That(customer.BillingAddresses.Count).IsEqualTo(1);
    }

    [Test]
    public async Task Customer_shipping_address_is_added()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));
        customer.AddShippingAddress(CustomerShippingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001"), "Leave at front door"));

        await Assert.That(customer.ShippingAddresses)
            .Count()
            .IsEqualTo(1);

        await Assert.That(customer.ShippingAddresses)
            .Satisfies(addresses => addresses is not null && addresses.All(a => a is { Type: "Shipping", Note: "Leave at front door" }));
    }

    [Test]
    public async Task Customer_does_not_add_duplicate_shipping_address()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));
        customer.AddShippingAddress(CustomerShippingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001"), "Leave at front door"));
        customer.AddShippingAddress(CustomerShippingAddress.Create(CustomerAddressId.New(), Address.From("456 Elm St", "Los Angeles", "90001"), "Other note"));

        await Assert.That(customer.ShippingAddresses.Count).IsEqualTo(1);
    }

    [Test]
    public async Task Customer_is_soft_deleted()
    {
        var customer = Customer.Create(CustomerId.New(), FullName.From("John", "Doe"));
        var fakeTime = new FakeTimeProvider();

        (customer as ISoftDelete).Delete(fakeTime);

        await Assert.That((customer as ISoftDelete).IsDeleted).IsTrue();
        await Assert.That(customer.DeletedAt).IsEqualTo(fakeTime.GetUtcNow());
    }
}
