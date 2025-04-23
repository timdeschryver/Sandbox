using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Domain;

public abstract class CustomerAddress
{
    public CustomerAddressId Id { get; init; }
    public abstract string Type { get; }
    public Address Address { get; protected set; }
}
