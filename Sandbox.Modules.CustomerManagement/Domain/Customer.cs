using Sandbox.SharedKernel.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Domain;

public class Customer : ISoftDelete
{
    public CustomerId Id { get; init; }
    public FullName Name { get; private set; }
    public DateTimeOffset? DeletedAt { get; set; }

    private readonly List<CustomerBillingAddress> _billingAddresses = [];
    public IReadOnlyCollection<CustomerBillingAddress> BillingAddresses => _billingAddresses.AsReadOnly();

    private readonly List<CustomerShippingAddress> _shippingAddresses = [];
    public IReadOnlyCollection<CustomerShippingAddress> ShippingAddresses => _shippingAddresses.AsReadOnly();

    public static Customer Create(CustomerId id, FullName name)
    {
        return new Customer
        {
            Id = id,
            Name = name,
        };
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
