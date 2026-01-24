using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.Handlers;

public partial class CustomerCreatedHandler
{
    public async Task Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger, [FromKeyedServices("Customers")] HybridCache cache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(cache);

        LogCustomerCreated(logger, message.Id, message.FirstName, message.LastName);

        await cache.InvalidateCustomersCacheAsync(cancellationToken);
    }

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Customer {CustomerId} created: {FirstName} {LastName}")]
    public static partial void LogCustomerCreated(
        ILogger logger,
        CustomerId customerId,
        string firstName,
        string lastName);
}
