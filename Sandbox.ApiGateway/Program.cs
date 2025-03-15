using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Sandbox.ApiGateway;
using Sandbox.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Configuration.AddAzureKeyVaultSecrets("key-vault", options: new AzureKeyVaultConfigurationOptions
{
    Manager = new PrefixKeyVaultSecretManager("Auth")
});

builder.Services.AddReverseProxy(builder.Configuration);
builder.Services.AddAuthenticationSchemes(builder.Configuration);

builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();

app.UseNoUnauthorizedRedirect("/api");
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("bff")
    .MapUserEndpoints();

app.MapReverseProxy();

app.Run();
