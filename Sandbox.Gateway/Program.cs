using Sandbox.Gateway;
using Sandbox.Gateway.UserModule;
using Sandbox.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddReverseProxy(builder.Configuration);
builder.Services.AddAuthenticationSchemes(builder.Configuration);

builder.Services.AddDistributedMemoryCache();
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

app.UseNoUnauthorizedRedirect("/api");
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("bff")
    .MapUserEndpoints();

app.MapReverseProxy();
app.MapDefaultEndpoints();

app.Run();
