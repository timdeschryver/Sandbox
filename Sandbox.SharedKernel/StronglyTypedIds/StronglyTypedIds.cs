using StronglyTypedIds;

namespace Sandbox.SharedKernel.StronglyTypedIds;

[StronglyTypedId(Template.Int, "int-efcore")]
public readonly partial struct CustomerId { }

[StronglyTypedId(Template.Int, "int-efcore")]
public readonly partial struct CustomerAddressId { }
