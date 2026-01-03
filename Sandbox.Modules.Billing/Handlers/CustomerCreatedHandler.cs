using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Logging;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.Billing.Handlers;

public class CustomerCreatedHandler
{
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        logger.LogBillingCustomerReceived(message.Id, message.FirstName, message.LastName);
    }
}
