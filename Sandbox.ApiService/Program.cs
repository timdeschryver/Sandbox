using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Sandbox.ApiService;
using Sandbox.ApiService.CustomerModule;
using Sandbox.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.Configuration.AddAzureKeyVaultSecrets("key-vault", options: new AzureKeyVaultConfigurationOptions {
    Manager = new PrefixKeyVaultSecretManager("Auth")
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, jwtOptions =>
    {
        jwtOptions.Authority = $"https://{builder.Configuration["OpenIDConnectSettings:Domain"]}";
        jwtOptions.Audience = builder.Configuration["OpenIDConnectSettings:Audience"];
    });
builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.AddSqlServerDbContext<ApiDbContext>(connectionName: "database");

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGroup("customers")
    .MapCustomerEndpoints();

app.MapDefaultEndpoints();

app.Run();
