using Microsoft.AspNetCore.Authentication.Cookies;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Sandbox.ApiGateway;
using Microsoft.AspNetCore.Authorization;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Sandbox.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Configuration.AddAzureKeyVaultSecrets("key-vault", options: new AzureKeyVaultConfigurationOptions
{
    Manager = new PrefixKeyVaultSecretManager("Auth")
});

builder.Services.AddSingleton<AddBearerTokenToHeadersTransformer>();

var reverseProxyBuilder = builder.Services
    .AddReverseProxy()
    .LoadFromMemory(
        [
            new RouteConfig {
                RouteId = "apiservice",
                ClusterId = "apiservice",
                Match = new RouteMatch { Path = "/api/{**catch-all}" },
                AuthorizationPolicy = "Default",
            }
                .WithTransformPathRemovePrefix(prefix: "/api"),
            new RouteConfig {
                RouteId = "otelcollector",
                ClusterId = "otelcollector",
                Match = new RouteMatch { Path = "/v1/traces" },
            },
            new RouteConfig {
                RouteId = "angularfrontend",
                ClusterId = "angularfrontend",
                Match = new RouteMatch { Path = "/{**catch-all}" },
            },
        ],
        [
            new ClusterConfig {
                ClusterId = "apiservice",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["apiservice"] =  new DestinationConfig {
                        Address = "http://apiservice"
                    }
                }
            },
            new ClusterConfig {
                ClusterId = "otelcollector",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["otelcollector"] =  new DestinationConfig {
                        Address = "http://otelcollector"
                    }
                }
            },
            new ClusterConfig {
                ClusterId = "angularfrontend",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["angularfrontend"] =  new DestinationConfig {
                        Address = "http://angularfrontend"
                    }
                }
            }
        ]
    )
    .AddTransforms(builderContext =>
    {
        if (!string.IsNullOrEmpty(builderContext.Route.AuthorizationPolicy))
        {
            builderContext.RequestTransforms.Add(builderContext.Services.GetRequiredService<AddBearerTokenToHeadersTransformer>());
        }
        builderContext.RequestTransforms.Add(new RequestHeaderRemoveTransform("Cookie"));
    });
// .AddServiceDiscoveryDestinationResolver();

// Temp fix: https://github.com/dotnet/aspire/issues/4605
if (!builder.Environment.IsProduction())
{
    reverseProxyBuilder.AddServiceDiscoveryDestinationResolver();
}

builder.Services.AddOptions<OpenIDConnectSettings>()
            .Bind(builder.Configuration.GetRequiredSection(OpenIDConnectSettings.Position))
            .ValidateDataAnnotations()
            .ValidateOnStart();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.Name = "__Sandbox";
    options.Cookie.SameSite = SameSiteMode.Strict;
})
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    var openIDConnectSettings = builder.Configuration.GetRequiredSection(OpenIDConnectSettings.Position).Get<OpenIDConnectSettings>() ?? throw new InvalidOperationException("OpenID Connect Settings are required.");

    options.Authority = $"https://{openIDConnectSettings.Domain}";
    options.ClientId = openIDConnectSettings.ClientId;
    options.ClientSecret = openIDConnectSettings.ClientSecret;

    options.ResponseType = OpenIdConnectResponseType.Code;
    options.ResponseMode = OpenIdConnectResponseMode.Query;

    options.GetClaimsFromUserInfoEndpoint = true;
    options.SaveTokens = true;
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role,
    };

    options.Scope.Clear();
    options.Scope.Add("openid");
    options.Scope.Add("profile");

    options.Events = new()
    {
        OnRedirectToIdentityProviderForSignOut = (context) =>
        {
            var logoutUri = $"https://{openIDConnectSettings.Domain}/oidc/logout?client_id={openIDConnectSettings.ClientId}";
            var redirectUrl = Helpers.BuildRedirectUrl(context.HttpContext, context.Properties.RedirectUri);
            logoutUri += $"&post_logout_redirect_uri={redirectUrl}";

            context.Response.Redirect(logoutUri);
            context.HandleResponse();
            return Task.CompletedTask;
        },
        OnRedirectToIdentityProvider = (context) =>
        {
            context.ProtocolMessage.SetParameter("audience", openIDConnectSettings.Audience);
            return Task.CompletedTask;
        },
    };
});

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder(CookieAuthenticationDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
});

builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();

app.UseNoUnauthorizedRedirect("/api");
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("bff").MapUserRoutes();

app.MapReverseProxy();

app.Run();
