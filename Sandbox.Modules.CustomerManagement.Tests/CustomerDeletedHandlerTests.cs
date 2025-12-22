using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Handlers;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Tests;

public sealed class CustomerDeletedHandlerTests
{
    [Test]
    public async Task Handler_invalidates_cache_when_customer_is_deleted()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerDeletedHandler>();
        var handler = new CustomerDeletedHandler();
        var message = new CustomerDeleted(CustomerId.New());

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await Assert.That(cache.InvalidateWasCalled).IsTrue();
    }

    [Test]
    public async Task Handler_logs_customer_deleted_event()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerDeletedHandler>();
        var handler = new CustomerDeletedHandler();
        var customerId = CustomerId.New();
        var message = new CustomerDeleted(customerId);

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await Assert.That(logger.LoggedMessages).IsNotEmpty();
    }

    [Test]
    public async Task Handler_throws_when_message_is_null()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerDeletedHandler>();
        var handler = new CustomerDeletedHandler();

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(null!, logger, cache, CancellationToken.None));
    }

    [Test]
    public async Task Handler_throws_when_logger_is_null()
    {
        var cache = new TestHybridCache();
        var handler = new CustomerDeletedHandler();
        var message = new CustomerDeleted(CustomerId.New());

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(message, null!, cache, CancellationToken.None));
    }

    [Test]
    public async Task Handler_throws_when_cache_is_null()
    {
        var logger = new TestLogger<CustomerDeletedHandler>();
        var handler = new CustomerDeletedHandler();
        var message = new CustomerDeleted(CustomerId.New());

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(message, logger, null!, CancellationToken.None));
    }
}
