using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.Logging;

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