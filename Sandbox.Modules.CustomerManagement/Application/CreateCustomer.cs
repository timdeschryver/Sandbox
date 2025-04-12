using Wolverine.Http;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Sandbox.SharedKernel.Messages;

namespace Sandbox.Modules.CustomerManagement.Application;

public static class CreateCustomer
{
    public sealed record Command(string? FirstName, string? LastName, BillingAddress? BillingAddress, ShippingAddress? ShippingAddress);
    public sealed record BillingAddress(string? Street, string? City, string? ZipCode);
    public sealed record ShippingAddress(string? Street, string? City, string? ZipCode, string? Note);

    [WolverinePost("/customers")]
    public static (Created<int>, CustomerCreated) Handle(Command command, CustomerDbContext dbContext)
    {
        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(dbContext);

        var customer = new Customer(FullName.From(command.FirstName, command.LastName));
        if (command.BillingAddress != null)
        {
            var billingAddress = Address.From(command.BillingAddress.Street, command.BillingAddress.City, command.BillingAddress.ZipCode);
            customer.AddBillingAddress(new CustomerBillingAddress(billingAddress));
        }
        if (command.ShippingAddress != null)
        {
            var shippingAddress = Address.From(command.ShippingAddress.Street, command.ShippingAddress.City, command.ShippingAddress.ZipCode);
            customer.AddShippingAddress(new CustomerShippingAddress(shippingAddress, command.ShippingAddress.Note ?? string.Empty));
        }

        dbContext.Add(customer);

        return (
            TypedResults.Created("/api/customers", customer.Id.Value),
            new CustomerCreated(customer.Id, customer.Name.FirstName, customer.Name.LastName)
        );
    }
}
