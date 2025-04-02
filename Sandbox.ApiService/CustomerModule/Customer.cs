namespace Sandbox.ApiService.CustomerModule;

public class Customer
{
    public int Id { get; init; }
    public FullName Name { get; private set; }

    private readonly List<CustomerBillingAddress> _billingAddresses = [];
    public IReadOnlyCollection<CustomerBillingAddress> BillingAddresses => _billingAddresses.AsReadOnly();

    private readonly List<CustomerShippingAddress> _shippingAddresses = [];
    public IReadOnlyCollection<CustomerShippingAddress> ShippingAddresses => _shippingAddresses.AsReadOnly();

    private Customer() { }
    public Customer(FullName name)
    {
        Name = name;
    }

    public void AddBillingAddress(CustomerBillingAddress address)
    {
        if (!_billingAddresses.Any(a => a.Address.Equals(address.Address)))
        {
            _billingAddresses.Add(address);
        }
    }

    public void AddShippingAddress(CustomerShippingAddress address)
    {
        if (!_shippingAddresses.Any(a => a.Address.Equals(address.Address)))
        {
            _shippingAddresses.Add(address);
        }
    }
}
