using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Domain;

public class CustomerShippingAddress : CustomerAddress
{
    public override string Type => "Shipping";
    public string Note { get; private set; } = default!;

    public static CustomerShippingAddress Create(CustomerAddressId customerAddressId, Address address, string note)
    {
        return new CustomerShippingAddress
        {
            Id = customerAddressId,
            Address = address,
            Note = note,
        };
    }
}
