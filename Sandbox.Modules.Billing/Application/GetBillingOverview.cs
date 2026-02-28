using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Sandbox.Modules.Billing.Application;

public static class GetBillingOverview
{
    public sealed record Request();
    public sealed record Response(string Message);

    /// <summary>
    /// Get billing overview.
    /// </summary>
    /// <returns>A stub billing overview response.</returns>
    public static Ok<Response> Query([AsParameters] Request _)
    {
        return TypedResults.Ok(new Response("Billing overview — coming soon."));
    }
}
