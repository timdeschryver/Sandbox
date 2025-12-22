using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Handlers;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Tests;

public sealed class CustomerCreatedHandlerTests
{
    [Test]
    public async Task Handler_invalidates_cache_when_customer_is_created()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerCreatedHandler>();
        var handler = new CustomerCreatedHandler();
        var message = new CustomerCreated(CustomerId.New(), "John", "Doe");

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await Assert.That(cache.InvalidateWasCalled).IsTrue();
    }

    [Test]
    public async Task Handler_logs_customer_created_event()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerCreatedHandler>();
        var handler = new CustomerCreatedHandler();
        var customerId = CustomerId.New();
        var message = new CustomerCreated(customerId, "Jane", "Smith");

        await handler.Handle(message, logger, cache, CancellationToken.None);

        await Assert.That(logger.LoggedMessages).IsNotEmpty();
    }

    [Test]
    public async Task Handler_throws_when_message_is_null()
    {
        var cache = new TestHybridCache();
        var logger = new TestLogger<CustomerCreatedHandler>();
        var handler = new CustomerCreatedHandler();

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(null!, logger, cache, CancellationToken.None));
    }

    [Test]
    public async Task Handler_throws_when_logger_is_null()
    {
        var cache = new TestHybridCache();
        var handler = new CustomerCreatedHandler();
        var message = new CustomerCreated(CustomerId.New(), "John", "Doe");

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(message, null!, cache, CancellationToken.None));
    }

    [Test]
    public async Task Handler_throws_when_cache_is_null()
    {
        var logger = new TestLogger<CustomerCreatedHandler>();
        var handler = new CustomerCreatedHandler();
        var message = new CustomerCreated(CustomerId.New(), "John", "Doe");

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await handler.Handle(message, logger, null!, CancellationToken.None));
    }

    private sealed class TestHybridCache : HybridCache
    {
        public bool InvalidateWasCalled { get; private set; }

        public override ValueTask<T> GetOrCreateAsync<TState, T>(
            string key,
            TState state,
            Func<TState, CancellationToken, ValueTask<T>> factory,
            HybridCacheEntryOptions? options = null,
            IEnumerable<string>? tags = null,
            CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public override ValueTask RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public override ValueTask RemoveByTagAsync(string tag, CancellationToken cancellationToken = default)
        {
            InvalidateWasCalled = true;
            return ValueTask.CompletedTask;
        }

        public override ValueTask SetAsync<T>(
            string key,
            T value,
            HybridCacheEntryOptions? options = null,
            IEnumerable<string>? tags = null,
            CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }

    private sealed class TestLogger<T> : ILogger<T>
    {
        public List<string> LoggedMessages { get; } = [];

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            LoggedMessages.Add(formatter(state, exception));
        }
    }
}
