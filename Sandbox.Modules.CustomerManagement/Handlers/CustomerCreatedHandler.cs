using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.SharedKernel.Logging;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.CustomerManagement.Handlers;

public class CustomerCreatedHandler
{
    public async Task Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger, [FromKeyedServices("Customers")] HybridCache cache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(cache);

        logger.LogCustomerCreated(message.Id, message.FirstName, message.LastName);

        await cache.InvalidateCustomersCacheAsync(cancellationToken);
    }
}
