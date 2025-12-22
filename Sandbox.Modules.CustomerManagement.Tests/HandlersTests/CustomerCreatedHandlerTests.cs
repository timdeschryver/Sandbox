using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Sandbox.Modules.CustomerManagement.Handlers;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Tests.HandlersTests;

public sealed class CustomerCreatedHandlerTests
{
    [Test]
    public async Task Handler_invalidates_cache_when_customer_is_created()
    {
        var cache = Substitute.For<HybridCache>();
        var logger = Substitute.For<ILogger<CustomerCreatedHandler>>();
        var handler = new CustomerCreatedHandler();
        var message = new CustomerCreated(CustomerId.New(), "John", "Doe");

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await cache.Received(1).RemoveByTagAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }
}
