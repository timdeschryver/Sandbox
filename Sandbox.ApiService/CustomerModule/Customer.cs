namespace Sandbox.ApiService.CustomerModule;

public class Customer
{
    public int Id { get; private set; }
    public Name Name { get; private set; }

    private readonly List<CustomerBillingAddress> _billingAddresses = [];
    public IReadOnlyCollection<CustomerBillingAddress> BillingAddresses => _billingAddresses.AsReadOnly();

    private readonly List<CustomerShippingAddress> _shippingAddresses = [];
    public IReadOnlyCollection<CustomerShippingAddress> ShippingAddresses => _shippingAddresses.AsReadOnly();

    public Customer(Name name)
    {
        Name = name;
    }

    private Customer() { }

    public void AddBillingAddress(CustomerBillingAddress address)
    {
        _billingAddresses.Add(address);
    }

    public void AddShippingAddress(CustomerShippingAddress address)
    {
        _shippingAddresses.Add(address);
    }
}
