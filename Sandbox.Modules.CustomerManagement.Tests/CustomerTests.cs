using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Tests;

internal sealed class CustomerTests
{
    [Test]
    public async Task Customer_is_created_with_billing_and_shipping_address()
    {
        var customer = new Customer(FullName.From("John", "Doe"));

        await Assert.That(customer.Name.ToString()).IsEqualTo("John Doe");
    }

    [Test]
    public async Task Customer_billing_address_is_added()
    {
        var customer = new Customer(FullName.From("John", "Doe"));
        customer.AddBillingAddress(new CustomerBillingAddress(Address.From("456 Elm St", "Los Angeles", "90001")));

        await Assert.That(customer.BillingAddresses.Count).IsEqualTo(1);
        await Assert.That(customer.BillingAddresses).All().Satisfy(
            assert => assert.IsNotNull().HasMember(s => s.Type).EqualTo("Billing")
        );
    }

    [Test]
    public async Task Customer_does_not_add_duplicate_billing_address()
    {
        var customer = new Customer(FullName.From("John", "Doe"));
        customer.AddBillingAddress(new CustomerBillingAddress(Address.From("456 Elm St", "Los Angeles", "90001")));
        customer.AddBillingAddress(new CustomerBillingAddress(Address.From("456 Elm St", "Los Angeles", "90001")));

        await Assert.That(customer.BillingAddresses.Count).IsEqualTo(1);
    }

    [Test]
    public async Task Customer_shipping_address_is_added()
    {
        var customer = new Customer(FullName.From("John", "Doe"));
        customer.AddShippingAddress(new CustomerShippingAddress(Address.From("456 Elm St", "Los Angeles", "90001"), "Leave at front door"));

        await Assert.That(customer.ShippingAddresses.Count).IsEqualTo(1);
        await Assert.That(customer.ShippingAddresses).All().Satisfy(
            assert => assert.IsNotNull()
                .HasMember(s => s.Type).EqualTo("Shipping")
                .HasMember(s => s.Note).EqualTo("Leave at front door")
        );
    }

    [Test]
    public async Task Customer_does_not_add_duplicate_shipping_address()
    {
        var customer = new Customer(FullName.From("John", "Doe"));
        customer.AddShippingAddress(new CustomerShippingAddress(Address.From("456 Elm St", "Los Angeles", "90001"), "Leave at front door"));
        customer.AddShippingAddress(new CustomerShippingAddress(Address.From("456 Elm St", "Los Angeles", "90001"), "Other note"));

        await Assert.That(customer.ShippingAddresses.Count).IsEqualTo(1);
    }
}