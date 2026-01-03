using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.Messages;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class CreateCustomer
{
    public sealed record Command([Required, MinLength(2)] string FirstName, [Required, MinLength(2)] string LastName, BillingAddress? BillingAddress, ShippingAddress? ShippingAddress);
    public sealed record BillingAddress([Required, MinLength(2)] string Street, [Required, MinLength(2)] string City, [Required, Length(2, 10)] string ZipCode);
    public sealed record ShippingAddress([Required, MinLength(2)] string Street, [Required, MinLength(2)] string City, [Required, Length(2, 10)] string ZipCode, string? Note);

    /// <summary>
    /// Create a new customer.
    /// </summary>
    /// <returns>The created customer ID.</returns>
    public static async Task<Created<CustomerId>> Handle(
        [FromBody] Command command,
        [NotNull][FromServices] IDbContextOutbox<CustomerDbContext> outbox,
        CancellationToken cancellationToken)
    {
        await Task.Delay(RandomNumberGenerator.GetInt32(0, 1000), cancellationToken);

        ArgumentNullException.ThrowIfNull(command);

        var customer = Customer.Create(CustomerId.New(), FullName.From(command.FirstName, command.LastName));
        if (command.BillingAddress != null)
        {
            var billingAddress = Address.From(command.BillingAddress.Street, command.BillingAddress.City, command.BillingAddress.ZipCode);
            customer.AddBillingAddress(CustomerBillingAddress.Create(CustomerAddressId.New(), billingAddress));
        }
        if (command.ShippingAddress != null)
        {
            var shippingAddress = Address.From(command.ShippingAddress.Street, command.ShippingAddress.City, command.ShippingAddress.ZipCode);
            customer.AddShippingAddress(CustomerShippingAddress.Create(CustomerAddressId.New(), shippingAddress, command.ShippingAddress.Note ?? string.Empty));
        }

        await outbox.DbContext.AddAsync(customer, cancellationToken);
        await outbox.PublishAsync(new CustomerCreated(customer.Id, customer.Name.FirstName, customer.Name.LastName));
        await outbox.SaveChangesAndFlushMessagesAsync(cancellationToken);

        return TypedResults.Created("/api/customers", customer.Id);
    }
}
