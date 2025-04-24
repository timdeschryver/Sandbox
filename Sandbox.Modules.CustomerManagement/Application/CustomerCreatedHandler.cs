using Sandbox.SharedKernel.Messages;
using Microsoft.Extensions.Logging;

namespace Sandbox.Modules.CustomerManagement.Application;

public class CustomerCreatedHandler
{
#pragma warning disable CA1822 // Mark members as static
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
#pragma warning restore CA1822 // Mark members as static
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        logger.LogInformation("Customer {CustomerId} created: {FirstName} {LastName}", message.Id, message.FirstName, message.LastName);
    }
}