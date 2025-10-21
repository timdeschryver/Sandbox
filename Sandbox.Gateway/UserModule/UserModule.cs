using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace Sandbox.Gateway.UserModule;

internal static partial class UserModule
{
    internal static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("user", (ClaimsPrincipal principal) =>
        {
            var user = principal switch
            {
                { Identity.IsAuthenticated: true } => new User
                {
                    IsAuthenticated = true,
                    Name = principal.FindFirstValue("name"),
                    Claims = principal.Claims.Select(c => new UserClaim { Type = c.Type, Value = c.Value }),
                },
                _ => new User
                {
                    IsAuthenticated = false,
                    Name = null
                }
            };

            return TypedResults.Ok(user);
        });

        builder.MapGet("login", (string? returnUrl, string? claimsChallenge, HttpContext context) =>
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = context.BuildRedirectUrl(returnUrl),
            };

            if (claimsChallenge != null)
            {
                string jsonString = claimsChallenge.Replace("\\", "", StringComparison.Ordinal).Trim(['"']);
                properties.Items["claims"] = jsonString;
            }

            return TypedResults.Challenge(properties);
        });

        builder.MapGet("logout", (string? redirectUrl, HttpContext context) =>
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = context.BuildRedirectUrl(redirectUrl),
            };

            return TypedResults.SignOut(properties, [CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme]);
        });

        return builder;
    }
}