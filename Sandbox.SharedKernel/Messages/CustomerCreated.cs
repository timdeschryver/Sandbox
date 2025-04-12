using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.SharedKernel.Messages;

public sealed record CustomerCreated(CustomerId Id, string FirstName, string LastName);
