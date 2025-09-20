using Microsoft.AspNetCore.Mvc;
using Sandbox.Modules.CustomerManagement.Application;
using Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;
using Sandbox.SharedKernel.StronglyTypedIds;
using System.Net;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests;

[ClassDataSource<CustomerApiWebApplicationFactory>(Shared = SharedType.PerTestSession)]
public class CustomerApiTests(CustomerApiWebApplicationFactory WebAppFactory)
{
    [Test]
    public async Task CreateCustomer_WithValidData_Returns_CreatedResponse()
    {
        using var client = WebAppFactory.CreateClient();

        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "John",
            LastName: "Doe",
            BillingAddress: new CreateCustomer.BillingAddress(
                Street: "123 Main St",
                City: "Anytown",
                ZipCode: "12345"
            ), ShippingAddress: new CreateCustomer.ShippingAddress(
                Street: "456 Oak Ave",
                City: "Somewhere",
                ZipCode: "67890",
                Note: "Leave at door"
            )
        );

        var response = await client.PostAsJsonAsync("/customers", createCustomerCommand);
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.Created);
    }

    [Test]
    public async Task CreateCustomer_WithMinimalData_Returns_CreatedResponse()
    {
        using var client = WebAppFactory.CreateClient();

        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "Jane",
            LastName: "Smith",
            BillingAddress: null,
            ShippingAddress: null
        );

        var response = await client.PostAsJsonAsync("/customers", createCustomerCommand);
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.Created);
    }

    [Test]
    public async Task CreateCustomer_WithInvalidData_Returns_BadRequestProblemDetails()
    {
        using var client = WebAppFactory.CreateClient();

        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "A",
            LastName: "B",
            BillingAddress: null,
            ShippingAddress: null
        );

        var response = await client.PostAsJsonAsync("/customers", createCustomerCommand);
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.BadRequest);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        await Assert.That(problemDetails).IsNotNull();
    }

    [Test]
    public async Task CreateCustomer_WithUnknownProperty_Returns_BadRequestProblemDetails()
    {
        using var client = WebAppFactory.CreateClient();

        var request = new
        {
            FirstName = "Firstname",
            LastName = "Lastname",
            UnknownProperty = "This should not be here"
        };

        var response = await client.PostAsJsonAsync("/customers", request);
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.BadRequest);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        await Assert.That(problemDetails).IsNotNull();
    }

    [Test]
    public async Task GetCustomers_Returns_OkWithCustomersList()
    {
        using var client = WebAppFactory.CreateClient();

        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "Test",
            LastName: "User",
            BillingAddress: null,
            ShippingAddress: null
        );

        await client.PostAsJsonAsync("/customers", createCustomerCommand);

        var response = await client.GetAsync(new Uri("/customers", UriKind.Relative));
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.OK);

        var customers = await response.Content.ReadFromJsonAsync<List<GetCustomers.Response>>();
        await Assert.That(customers).IsNotNull();
        await Assert.That(customers!.Count).IsGreaterThan(0);
    }

    [Test]
    public async Task GetCustomer_WithValidId_Returns_OkWithCustomer()
    {
        using var client = WebAppFactory.CreateClient();

        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "Individual",
            LastName: "Customer",
            BillingAddress: new CreateCustomer.BillingAddress(
                Street: "789 Pine St",
                City: "TestCity",
                ZipCode: "54321"
            ),
            ShippingAddress: null
        );

        var createResponse = await client.PostAsJsonAsync("/customers", createCustomerCommand);
        var customerId = await createResponse.Content.ReadFromJsonAsync<CustomerId>();

        var response = await client.GetAsync(new Uri($"/customers/{customerId}", UriKind.Relative));
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.OK);

        var customer = await response.Content.ReadFromJsonAsync<GetCustomer.Response>();
        await Assert.That(customer).IsNotNull();
        await Assert.That(customer!.FirstName).IsEqualTo("Individual");
        await Assert.That(customer.LastName).IsEqualTo("Customer");
        await Assert.That(customer.BillingAddresses.Count()).IsEqualTo(1);
        await Assert.That(customer.ShippingAddresses.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetCustomer_WithNonExistentId_Returns_NotFound()
    {
        using var client = WebAppFactory.CreateClient();
        var nonExistentId = CustomerId.New();

        var response = await client.GetAsync(new Uri($"/customers/{nonExistentId}", UriKind.Relative));
        await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task RemovedCustomer_IsNotIncluded()
    {
        using var client = WebAppFactory.CreateClient();
        var createCustomerCommand = new CreateCustomer.Command(
            FirstName: "Jane",
            LastName: "Smith",
            BillingAddress: null,
            ShippingAddress: null
        );

        var createdResponse = await client.PostAsJsonAsync("/customers", createCustomerCommand);
        await Assert.That(createdResponse.StatusCode).IsEqualTo(HttpStatusCode.Created);

        var customerId = await createdResponse.Content.ReadFromJsonAsync<CustomerId>();

        var getResponse = await client.GetAsync(new Uri($"/customers/{customerId}", UriKind.Relative));
        await Assert.That(getResponse.StatusCode).IsEqualTo(HttpStatusCode.OK);

        var deleteResponse = await client.DeleteAsync(new Uri($"/customers/{customerId}", UriKind.Relative));
        await Assert.That(deleteResponse.StatusCode).IsEqualTo(HttpStatusCode.NoContent);

        var postDeleteResponse = await client.GetAsync(new Uri($"/customers/{customerId}", UriKind.Relative));
        await Assert.That(postDeleteResponse.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }
}
