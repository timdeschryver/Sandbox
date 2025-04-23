using Vogen;

namespace Sandbox.SharedKernel.StronglyTypedIds;

[ValueObject<Guid>(conversions: Conversions.SystemTextJson | Conversions.EfCoreValueConverter)]
public partial struct CustomerId
{
    public static CustomerId New() => From(Guid.NewGuid());
};

[ValueObject<Guid>(conversions: Conversions.SystemTextJson | Conversions.EfCoreValueConverter)]
public partial struct CustomerAddressId
{
    public static CustomerAddressId New() => From(Guid.NewGuid());
}
