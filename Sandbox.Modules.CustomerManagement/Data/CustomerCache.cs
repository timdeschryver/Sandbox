using Microsoft.Extensions.Caching.Hybrid;
using Sandbox.Modules.CustomerManagement.Application;

namespace Sandbox.Modules.CustomerManagement.Data;

internal static class CustomerCache
{
    private const string CustomersCacheKey = "all";
    private static readonly IReadOnlyList<string> CustomersTags = ["customers"];

    internal static async Task<List<GetCustomers.Response>> GetOrCreateCustomersAsync(
        this HybridCache cache,
        Func<CancellationToken, Task<List<GetCustomers.Response>>> factory,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(factory);

        return await cache.GetOrCreateAsync(
            CustomersCacheKey,
            async token => await factory(token),
            tags: CustomersTags,
            cancellationToken: cancellationToken);
    }

    internal static async Task InvalidateCustomersCacheAsync(this HybridCache cache, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(cache);
        await cache.RemoveByTagAsync(CustomersTags, cancellationToken);
    }
}
