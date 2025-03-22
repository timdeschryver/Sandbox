using Sandbox.ApiService.CustomerModule.Endpoints;

namespace Sandbox.ApiService.CustomerModule;

internal static class CustomerModuleConfiguration
{
    internal static IEndpointRouteBuilder MapCustomerEndpoints(this IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapCreateCustomer()
            .MapGetCustomer()
            .MapGetCustomers();
}
