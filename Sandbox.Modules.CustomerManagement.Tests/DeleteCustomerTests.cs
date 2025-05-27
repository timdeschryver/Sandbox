using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sandbox.Modules.CustomerManagement.Application;
using Sandbox.Modules.CustomerManagement.Data;
using Sandbox.Modules.CustomerManagement.Domain;
using Sandbox.SharedKernel.StronglyTypedIds;
using Wolverine.EntityFrameworkCore;

namespace Sandbox.Modules.CustomerManagement.Tests;

internal sealed class DeleteCustomerTests
{
    [Test]
    public async Task Handle_deletes_customer_when_exists()
    {
        // Arrange
        var customerId = CustomerId.New();
        var customer = Customer.Create(customerId, FullName.From("John", "Doe"));

        var dbContextOptions = new DbContextOptionsBuilder<CustomerDbContext>()
            .UseInMemoryDatabase("DeleteCustomerTest")
            .Options;

        await using var dbContext = new CustomerDbContext(dbContextOptions);
        await dbContext.AddAsync(customer);
        await dbContext.SaveChangesAsync();

        var serviceProvider = new ServiceCollection()
            .AddDbContext<CustomerDbContext>(options => options.UseInMemoryDatabase("DeleteCustomerTest"))
            .AddWolverine(options => options.UseEntityFrameworkCoreTransactions())
            .BuildServiceProvider();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = serviceProvider,
        };

        // Act
        var result = await DeleteCustomer.Handle(customerId, httpContext, CancellationToken.None);

        // Assert
        await Assert.That(result).IsInstanceOf<NoContent>();
        
        await using var verifyContext = new CustomerDbContext(dbContextOptions);
        var customerExists = await verifyContext.Set<Customer>().AnyAsync(c => c.Id == customerId);
        await Assert.That(customerExists).IsFalse();
    }

    [Test]
    public async Task Handle_returns_not_found_when_customer_does_not_exist()
    {
        // Arrange
        var customerId = CustomerId.New();

        var dbContextOptions = new DbContextOptionsBuilder<CustomerDbContext>()
            .UseInMemoryDatabase("DeleteCustomerNotFoundTest")
            .Options;

        var serviceProvider = new ServiceCollection()
            .AddDbContext<CustomerDbContext>(options => options.UseInMemoryDatabase("DeleteCustomerNotFoundTest"))
            .AddWolverine(options => options.UseEntityFrameworkCoreTransactions())
            .BuildServiceProvider();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = serviceProvider,
        };

        // Act
        var result = await DeleteCustomer.Handle(customerId, httpContext, CancellationToken.None);

        // Assert
        await Assert.That(result).IsInstanceOf<NotFound>();
    }
}