using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.SharedKernel.Logging;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.CustomerManagement.Application;

public class CustomerDeletedHandler
{
    public async Task Handle(CustomerDeleted message, ILogger<CustomerDeletedHandler> logger, [FromKeyedServices("Customers")] HybridCache cache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(cache);

        logger.LogCustomerDeleted(message.Id);
        await cache.InvalidateCustomersCacheAsync(cancellationToken);
    }
}
