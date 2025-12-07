using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.Logging;
using Microsoft.Extensions.Logging;

namespace Sandbox.Modules.CustomerManagement.Application;

public class CustomerCreatedHandler
{
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        logger.LogCustomerCreated(message.Id, message.FirstName, message.LastName);
    }
}
