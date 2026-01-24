using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Handlers;

public partial class CustomerDeletedHandler
{
    public async Task Handle(CustomerDeleted message, ILogger<CustomerDeletedHandler> logger, [FromKeyedServices("Customers")] HybridCache cache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(cache);

        LogCustomerDeleted(logger, message.Id);

        await cache.InvalidateCustomersCacheAsync(cancellationToken);
    }

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Customer {CustomerId} deleted")]
    public static partial void LogCustomerDeleted(
        ILogger logger,
        CustomerId customerId);
}
