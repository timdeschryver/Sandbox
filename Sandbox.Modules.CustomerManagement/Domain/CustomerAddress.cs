using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Domain;

public abstract class CustomerAddress
{
    public CustomerAddressId Id { get; init; }
    public abstract string Type { get; }
    public Address Address { get; private set; }

    protected CustomerAddress(Address address)
    {
        Address = address;
    }
    protected CustomerAddress() { }
}
