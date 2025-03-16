namespace Sandbox.ApiService.CustomerModule;

public class Customer
{
    public int Id { get; private set; }
    public Name Name { get; private set; }

    private readonly List<CustomerBillingAddress> _billingAddresses = [];
    public IReadOnlyCollection<CustomerBillingAddress> BillingAddresses => _billingAddresses.AsReadOnly();

    private readonly List<CustomerShippingAddress> _shippingAddresses = [];
    public IReadOnlyCollection<CustomerShippingAddress> ShippingAddresses => _shippingAddresses.AsReadOnly();

    public void AddBillingAddress(CustomerBillingAddress address)
    {
        _billingAddresses.Add(address);
    }

    public void AddShippingAddress(CustomerShippingAddress address)
    {
        _shippingAddresses.Add(address);
    }

    public static Customer New(Name name, CustomerBillingAddress? customerBillingAddress, CustomerShippingAddress? customerShippingAddress)
    {
        var customer = new Customer
        {
            Name = name
        };

        if (customerBillingAddress != null)
        {
            customer.AddBillingAddress(customerBillingAddress);
        }

        if (customerShippingAddress != null)
        {
            customer.AddShippingAddress(customerShippingAddress);
        }

        return customer;
    }
}
