using System.Net;
using Microsoft.AspNetCore.Mvc;
using Sandbox.Modules.CustomerManagement.IntegrationTests.Setup;
using Sandbox.SharedKernel.StronglyTypedIds;
using TUnit.AspNetCore;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests;

public class CustomerApiTests : WebApplicationTest<CustomerApiWebApplicationFactory, Program>
{
    [Test]
    public async Task CreateCustomer_WithValidData_Returns_CreatedResponse()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        var response = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "John",
            LastName = "Doe",
            BillingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request.Request_billingAddress()
            {
                BillingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.BillingAddress()
                {
                    Street = "123 Main St",
                    City = "Anytown",
                    ZipCode = "12345"
                }
            },
            ShippingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request.Request_shippingAddress()
            {
                ShippingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.ShippingAddress()
                {
                    Street = "456 Oak Ave",
                    City = "Somewhere",
                    ZipCode = "67890",
                    Note = "Leave at door"
                }
            }
        });

        _ = await Assert.That(response).IsNotNull();
    }

    [Test]
    public async Task CreateCustomer_WithMinimalData_Returns_CreatedResponse()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        var response = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "Jane",
            LastName = "Smith",
            BillingAddress = null,
            ShippingAddress = null
        });

        _ = await Assert.That(response).IsNotNull();
    }

    [Test]
    public async Task CreateCustomer_WithInvalidData_Returns_BadRequestProblemDetails()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        try
        {
            _ = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
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
            _ = await Assert.That(ex.ResponseStatusCode).IsEqualTo(StatusCodes.Status400BadRequest);
        }
    }

    [Test]
    public async Task CreateCustomer_WithUnknownProperty_Returns_BadRequestProblemDetails()
    {
        using var client = Factory.CreateClient();

        // For this test, we'll send a raw HTTP request with unknown property since Kiota's typed client
        // won't allow unknown properties by design. This test verifies server-side validation.
        var request = new
        {
            FirstName = "Firstname",
            LastName = "Lastname",
            UnknownProperty = "This should not be here"
        };

        var response = await client.PostAsJsonAsync("/customers", request);
        _ = await Assert.That(response.StatusCode).IsEqualTo(HttpStatusCode.BadRequest);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        _ = await Assert.That(problemDetails).IsNotNull();
    }

    [Test]
    public async Task GetCustomers_Returns_OkWithCustomersList()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        _ = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "Test",
            LastName = "User",
            BillingAddress = null,
            ShippingAddress = null
        });
        _ = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "Test 2",
            LastName = "User 2",
            BillingAddress = null,
            ShippingAddress = null
        });

        var customers = await apiClient.Customers.GetAsync();
        _ = await Assert.That(customers).IsNotNull();
        _ = await Assert.That(customers!.Count).IsGreaterThanOrEqualTo(2);

        _ = await Verify(customers.OrderBy(c => c.FirstName).ThenBy(c => c.LastName));
    }

    [Test]
    public async Task GetCustomer_WithValidId_Returns_OkWithCustomer()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        var createResponse = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "Individual",
            LastName = "Customer",
            BillingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request.Request_billingAddress()
            {
                BillingAddress = new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.BillingAddress()
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
        _ = await Assert.That(customer).IsNotNull();
        _ = await Assert.That(customer!.FirstName).IsEqualTo("Individual");
        _ = await Assert.That(customer.LastName).IsEqualTo("Customer");
        _ = await Assert.That(customer.BillingAddresses?.Count).IsEqualTo(1);
        _ = await Assert.That(customer.ShippingAddresses?.Count).IsEqualTo(0);

        _ = await Verify(customer);
    }

    [Test]
    public async Task GetCustomer_WithNonExistentId_Returns_NotFound()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        var nonExistentId = CustomerId.New();

        try
        {
            _ = await apiClient.Customers[nonExistentId.ToString()].GetAsync();
            Assert.Fail("Expected ApiException was not thrown");
        }
        catch (Microsoft.Kiota.Abstractions.ApiException ex)
        {
            _ = await Assert.That(ex.ResponseStatusCode).IsEqualTo(StatusCodes.Status404NotFound);
        }
    }

    [Test]
    public async Task RemovedCustomer_IsNotIncluded()
    {
        var apiClient = CustomerApiWebApplicationFactory.CreateApiClient(Factory.CreateClient());

        var createResponse = await apiClient.Customers.PostAsync(new ApiServiceSDK.Models.Modules.CustomerManagement.Application.CreateCustomer.Request()
        {
            FirstName = "Jane",
            LastName = "Smith",
            BillingAddress = null,
            ShippingAddress = null
        });
        var customerId = (string)createResponse!.GetType().GetField("_value", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!.GetValue(createResponse)!;

        var customer = await apiClient.Customers[customerId!.ToString()].GetAsync();
        _ = await Assert.That(customer).IsNotNull();

        await apiClient.Customers[customerId.ToString()].DeleteAsync();

        try
        {
            _ = await apiClient.Customers[customerId.ToString()].GetAsync();
            Assert.Fail("Expected ApiException was not thrown");
        }
        catch (Microsoft.Kiota.Abstractions.ApiException ex)
        {
            _ = await Assert.That(ex.ResponseStatusCode).IsEqualTo(StatusCodes.Status404NotFound);
        }
    }
}
