using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace Sandbox.ApiGateway;

public static class UserFeature
{
    public static void MapUserRoutes(this IEndpointRouteBuilder builder)
    {
        builder.Map("/user", (ClaimsPrincipal principal) =>
        {
            if (principal.Identity?.IsAuthenticated == true)
            {
                return TypedResults.Ok(new User
                {
                    IsAuthenticated = true,
                    Name = principal.Claims.SingleOrDefault(c => c.Type == "name")?.Value,
                    Claims = principal.Claims.Select(c => new UserClaim { Type = c.Type, Value = c.Value }),
                });
            }
            return TypedResults.Ok(new User
            {
                IsAuthenticated = false,
                Name = null
            });
        });
        builder.Map("/login", (string? returnUrl, string? claimsChallenge, HttpContext context) =>
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = context.BuildRedirectUrl(returnUrl),
            };

            if (claimsChallenge != null)
            {
                string jsonString = claimsChallenge.Replace("\\", "").Trim(['"']);
                properties.Items["claims"] = jsonString;
            }

            return TypedResults.Challenge(properties);
        });
        builder.Map("/logout", (string? redirectUrl, HttpContext context) =>
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = context.BuildRedirectUrl(redirectUrl),
            };

            return TypedResults.SignOut(properties, [CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme]);
        });
    }

    internal class User
    {
        public bool IsAuthenticated { get; init; }
        public string? Name { get; init; }
        public IEnumerable<UserClaim> Claims { get; init; } = [];
    }

    internal class UserClaim
    {
        public required string Type { get; init; }
        public required string Value { get; init; }
    }
}