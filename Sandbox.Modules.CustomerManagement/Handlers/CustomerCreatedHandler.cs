using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.Logging;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.CustomerManagement.Data;

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
