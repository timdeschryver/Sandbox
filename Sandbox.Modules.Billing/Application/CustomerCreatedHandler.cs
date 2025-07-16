using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.Billing.Application;

public class CustomerCreatedHandler
{
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        logger.LogInformation("Billing received {CustomerId}: {FirstName} {LastName}", message.Id, message.FirstName, message.LastName);
    }
}