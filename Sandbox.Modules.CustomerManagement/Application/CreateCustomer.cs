using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;

namespace Sandbox.Modules.CustomerManagement.Application;

internal static class CreateCustomer
{
    internal sealed record Command(string? FirstName, string? LastName, BillingAddress? BillingAddress, ShippingAddress? ShippingAddress);
    internal sealed record BillingAddress(string? Street, string? City, string? ZipCode);
    internal sealed record ShippingAddress(string? Street, string? City, string? ZipCode, string? Note);

    internal static async Task<Created<int>> Handle(
        [FromBody] Command request,
        [FromServices] CustomerDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var customer = new Customer(FullName.From(request.FirstName, request.LastName));
        if (request.BillingAddress != null)
        {
            var billingAddress = Address.From(request.BillingAddress.Street, request.BillingAddress.City, request.BillingAddress.ZipCode);
            customer.AddBillingAddress(new CustomerBillingAddress(billingAddress));
        }
        if (request.ShippingAddress != null)
        {
            var shippingAddress = Address.From(request.ShippingAddress.Street, request.ShippingAddress.City, request.ShippingAddress.ZipCode);
            customer.AddShippingAddress(new CustomerShippingAddress(shippingAddress, request.ShippingAddress.Note ?? string.Empty));
        }

        await dbContext.AddAsync(customer, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.Created("/api/customers", customer.Id.Value);
    }
}
