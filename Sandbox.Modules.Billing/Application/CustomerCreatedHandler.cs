using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.Billing.Application;

public class CustomerCreatedHandler
{
#pragma warning disable CA1822 // Mark members as static
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
#pragma warning restore CA1822 // Mark members as static
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        logger.LogInformation("Billing received {CustomerId}: {FirstName} {LastName}", message.Id, message.FirstName, message.LastName);
    }
}