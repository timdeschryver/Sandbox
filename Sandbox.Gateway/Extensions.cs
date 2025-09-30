using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Sandbox.Gateway.Transformers;
using System.Security.Claims;
using Yarp.ReverseProxy.Transforms;

namespace Sandbox.Gateway;

internal static class Extensions
{
    public static IHostApplicationBuilder AddReverseProxy(this IHostApplicationBuilder builder)
    {
        builder.Services.AddSingleton<AddBearerTokenToHeadersTransform>();
        builder.Services.AddSingleton<AddAntiforgeryTokenResponseTransform>();
        builder.Services.AddSingleton<ValidateAntiforgeryTokenRequestTransform>();

        builder.Services
            .AddReverseProxy()
            .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
            .AddTransforms(builderContext =>
            {
                builderContext.ResponseTransforms.Add(builderContext.Services.GetRequiredService<AddAntiforgeryTokenResponseTransform>());
                builderContext.RequestTransforms.Add(builderContext.Services.GetRequiredService<ValidateAntiforgeryTokenRequestTransform>());
                builderContext.RequestTransforms.Add(new RequestHeaderRemoveTransform("Cookie"));

                if (!string.IsNullOrEmpty(builderContext.Route.AuthorizationPolicy))
                {
                    builderContext.RequestTransforms.Add(builderContext.Services.GetRequiredService<AddBearerTokenToHeadersTransform>());
                }
            })
            .AddServiceDiscoveryDestinationResolver();

        return builder;
    }

    public static IHostApplicationBuilder AddAuthenticationSchemes(this IHostApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
        })
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
        {
            options.Cookie.Name = "__Sandbox";
            options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        })
        .AddKeycloakOpenIdConnect(
            serviceName: "keycloak",
            realm: "sandbox",
            configureOptions: options =>
            {
                options.ClientId = "sandbox-gateway";
                options.ClientSecret = builder.Configuration.GetValue<string>("OpenIDConnectSettings:ClientSecret");
                options.ResponseType = OpenIdConnectResponseType.Code;
                options.ResponseMode = OpenIdConnectResponseMode.Query;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.SaveTokens = true;
                options.MapInboundClaims = false;
                options.CallbackPath = "/signin-oidc";

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier,
                    RoleClaimType = ClaimTypes.Role,
                };

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("email");
                options.Scope.Add("offline_access");
                options.Scope.Add("sandbox:all");

                if (builder.Environment.IsDevelopment())
                {
                    options.RequireHttpsMetadata = false;
                }
            });

        builder.Services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder(CookieAuthenticationDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
        });

        return builder;
    }

    public static string BuildRedirectUrl(this HttpContext context, string? redirectUrl)
    {
        if (string.IsNullOrEmpty(redirectUrl))
        {
            redirectUrl = "/";
        }
        if (redirectUrl.StartsWith('/'))
        {
            redirectUrl = context.Request.Scheme + "://" + context.Request.Host + context.Request.PathBase + redirectUrl;
        }
        return redirectUrl;
    }
}

