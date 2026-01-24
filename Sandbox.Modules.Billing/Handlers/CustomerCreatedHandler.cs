using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.Billing.Handlers;

public partial class CustomerCreatedHandler
{
    public void Handle(CustomerCreated message, ILogger<CustomerCreatedHandler> logger)
    {
        ArgumentNullException.ThrowIfNull(message);
        ArgumentNullException.ThrowIfNull(logger);

        LogBillingCustomerReceived(logger, message.Id, message.FirstName, message.LastName);
    }

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Billing received customer {CustomerId}: {FirstName} {LastName}")]
    public static partial void LogBillingCustomerReceived(
        ILogger logger,
        CustomerId customerId,
        string firstName,
        string lastName);
}
