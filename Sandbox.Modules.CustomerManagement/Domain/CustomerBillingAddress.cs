using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Domain;

public class CustomerBillingAddress : CustomerAddress
{
    public override string Type => "Billing";

    public static CustomerBillingAddress Create(CustomerAddressId customerAddressId, Address address)
    {
        return new CustomerBillingAddress
        {
            Id = customerAddressId,
            Address = address,
        };
    }
}
