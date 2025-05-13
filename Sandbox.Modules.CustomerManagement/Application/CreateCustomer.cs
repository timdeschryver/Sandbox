using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Sandbox.SharedKernel.Messages;
using Microsoft.AspNetCore.Mvc;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.DependencyInjection;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class CreateCustomer
{
    public sealed record Command([Required, MinLength(2)] string FirstName, [Required, MinLength(2)] string LastName, BillingAddress? BillingAddress, ShippingAddress? ShippingAddress);
    public sealed record BillingAddress([Required, MinLength(2)] string Street, [Required, MinLength(2)] string City, [Required, Length(2, 10)] string ZipCode);
    public sealed record ShippingAddress([Required, MinLength(2)] string Street, [Required, MinLength(2)] string City, [Required, Length(2, 10)] string ZipCode, string? Note);

    /// <summary>
    /// Create a new customer.
    /// Optionally, you can provide a billing address and a shipping address.
    /// </summary>
    /// <returns>The created customer ID.</returns>
    public static async Task<Created<CustomerId>> Handle(
        [FromBody] Command command,
        // [FromServices] IDbContextOutbox<CustomerDbContext> outbox,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(httpContext);

        // TODO: Should be injected, but this is a workaround for https://github.com/dotnet/aspnetcore/issues/61388
        var outbox = httpContext.RequestServices.GetRequiredService<IDbContextOutbox<CustomerDbContext>>();
        ArgumentNullException.ThrowIfNull(outbox);

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
