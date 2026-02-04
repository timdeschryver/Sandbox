using System.Net;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests;

[ClassDataSource<CustomerApiWebApplicationFactory>(Shared = SharedType.None)]
public class CustomerApiTests(CustomerApiWebApplicationFactory webAppFactory)
{
    private readonly CustomerApiWebApplicationFactory _webAppFactory = webAppFactory;

    [Test]
    public async Task CreateCustomer_WithValidData_Returns_CreatedResponse()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        var response = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "John",
            LastName = "Doe",
            BillingAddress = new ApiServiceSDK.Models.Command.Command_billingAddress()
            {
                BillingAddress = new ApiServiceSDK.Models.BillingAddress()
                {
                    Street = "123 Main St",
                    City = "Anytown",
                    ZipCode = "12345"
                }
            },
            ShippingAddress = new ApiServiceSDK.Models.Command.Command_shippingAddress()
            {
                ShippingAddress = new ApiServiceSDK.Models.ShippingAddress()
                {
                    Street = "456 Oak Ave",
                    City = "Somewhere",
                    ZipCode = "67890",
                    Note = "Leave at door"
                }
            }
        });

        await Assert.That(response).IsNotNull();
    }

    [Test]
    public async Task CreateCustomer_WithMinimalData_Returns_CreatedResponse()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        var response = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "Jane",
            LastName = "Smith",
            BillingAddress = null,
            ShippingAddress = null
        });

        await Assert.That(response).IsNotNull();
    }

    [Test]
    public async Task CreateCustomer_WithInvalidData_Returns_BadRequestProblemDetails()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        try
        {
            await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
            {
                FirstName = "A",
                LastName = "B",
                BillingAddress = null,
                ShippingAddress = null
            });

            Assert.Fail("Expected ApiException was not thrown");
        }
        catch (Microsoft.Kiota.Abstractions.ApiException ex)
        {
            await Assert.That(ex.ResponseStatusCode).IsEqualTo(400);
        }
    }

    [Test]
    public async Task CreateCustomer_WithUnknownProperty_Returns_BadRequestProblemDetails()
    {
        using var client = _webAppFactory.CreateClient();

        // For this test, we'll send a raw HTTP request with unknown property since Kiota's typed client
        // won't allow unknown properties by design. This test verifies server-side validation.
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
        var apiClient = _webAppFactory.CreateApiClient();

        await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "Test",
            LastName = "User",
            BillingAddress = null,
            ShippingAddress = null
        });
        await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "Test 2",
            LastName = "User 2",
            BillingAddress = null,
            ShippingAddress = null
        });

        var customers = await apiClient.Customers.GetAsync();
        await Assert.That(customers).IsNotNull();
        await Assert.That(customers!.Count).IsGreaterThanOrEqualTo(2);

        await Verify(customers.OrderBy(c => c.FirstName).ThenBy(c => c.LastName));
    }

    [Test]
    public async Task GetCustomer_WithValidId_Returns_OkWithCustomer()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        var createResponse = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "Individual",
            LastName = "Customer",
            BillingAddress = new ApiServiceSDK.Models.Command.Command_billingAddress()
            {
                BillingAddress = new ApiServiceSDK.Models.BillingAddress()
                {
                    Street = "789 Pine Rd",
                    City = "Elsewhere",
                    ZipCode = "54321"
                }
            },
            ShippingAddress = null
        });
        var customerId = (string)createResponse!.GetType().GetField("_value", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!.GetValue(createResponse)!;

        var customer = await apiClient.Customers[customerId!.ToString()].GetAsync();
        await Assert.That(customer).IsNotNull();
        await Assert.That(customer!.FirstName).IsEqualTo("Individual");
        await Assert.That(customer.LastName).IsEqualTo("Customer");
        await Assert.That(customer.BillingAddresses?.Count).IsEqualTo(1);
        await Assert.That(customer.ShippingAddresses?.Count).IsEqualTo(0);

        await Verify(customer);
    }

    [Test]
    public async Task GetCustomer_WithNonExistentId_Returns_NotFound()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        var nonExistentId = CustomerId.New();

        try
        {
            await apiClient.Customers[nonExistentId.ToString()].GetAsync();
            Assert.Fail("Expected ApiException was not thrown");
        }
        catch (Microsoft.Kiota.Abstractions.ApiException ex)
        {
            await Assert.That(ex.ResponseStatusCode).IsEqualTo(404);
        }
    }

    [Test]
    public async Task RemovedCustomer_IsNotIncluded()
    {
        var apiClient = _webAppFactory.CreateApiClient();

        var createResponse = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Command()
        {
            FirstName = "Jane",
            LastName = "Smith",
            BillingAddress = null,
            ShippingAddress = null
        });
        var customerId = (string)createResponse!.GetType().GetField("_value", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!.GetValue(createResponse)!;

        var customer = await apiClient.Customers[customerId!.ToString()].GetAsync();
        await Assert.That(customer).IsNotNull();

        await apiClient.Customers[customerId.ToString()].DeleteAsync();

        try
        {
            await apiClient.Customers[customerId.ToString()].GetAsync();
            Assert.Fail("Expected ApiException was not thrown");
        }
        catch (Microsoft.Kiota.Abstractions.ApiException ex)
        {
            await Assert.That(ex.ResponseStatusCode).IsEqualTo(404);
        }
    }
}
