using Duende.AccessTokenManagement.OpenIdConnect;
using Sandbox.Gateway;
using Sandbox.Gateway.FeatureFlagsModule;
using Sandbox.Gateway.UserModule;
using Sandbox.ServiceDefaults;
using Sandbox.SharedKernel.FeatureFlags;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false;
});

builder.AddServiceDefaults();
builder.AddAuthenticationSchemes();
builder.AddRateLimiting();
builder.AddReverseProxy();
builder.AddFeatureFlags();

builder.AddRedisDistributedCache(connectionName: "cache");
builder.Services.AddOpenIdConnectAccessTokenManagement();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.SameSite = SameSiteMode.Strict;
});
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();
app.UseAntiforgery();

app.UseAuthentication();
app.UseRateLimiter();
app.UseAuthorization();

app.MapGroup("bff")
    .MapUserEndpoints()
    .MapFeatureFlagEndpoints();

app.MapReverseProxy();
app.MapDefaultEndpoints();

app.Run();
