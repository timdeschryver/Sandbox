using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Sandbox.Modules.CustomerManagement.Handlers;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Tests.HandlersTests;

public sealed class CustomerDeletedHandlerTests
{
    [Test]
    public async Task Handler_invalidates_cache_when_customer_is_deleted()
    {
        var cache = Substitute.For<HybridCache>();
        var logger = Substitute.For<ILogger<CustomerDeletedHandler>>();
        var handler = new CustomerDeletedHandler();
        var message = new CustomerDeleted(CustomerId.New());

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await cache.Received(1).RemoveByTagAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }
}
