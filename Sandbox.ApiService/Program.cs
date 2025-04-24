using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Oakton.Resources;
using Sandbox.ServiceDefaults;
using Sandbox.SharedKernel.Modules;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Http;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Configuration.AddAzureKeyVaultSecrets("key-vault", options: new AzureKeyVaultConfigurationOptions
{
    Manager = new PrefixKeyVaultSecretManager("Auth")
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, jwtOptions =>
    {
        jwtOptions.Authority = $"https://{builder.Configuration["OpenIDConnectSettings:Domain"]}";
        jwtOptions.Audience = builder.Configuration["OpenIDConnectSettings:Audience"];
    });

builder.Services.AddAuthorization();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

builder.Services.AddResourceSetupOnStartup();
builder.Host.UseWolverine(opts =>
{
    var connectionString = builder.Configuration.GetConnectionString("sandbox-db") ?? throw new InvalidOperationException("Connection string 'sandbox-db' not found.");
    opts.PersistMessagesWithPostgresql(connectionString, "wolverine");
    opts.UseEntityFrameworkCoreTransactions();
    opts.MultipleHandlerBehavior = MultipleHandlerBehavior.Separated;
    opts.Durability.MessageIdentity = MessageIdentity.IdAndDestination;
    opts.Policies.UseDurableLocalQueues();
    opts.Policies.AutoApplyTransactions();
});

builder.AddModules();
builder.Services.AddWolverineHttp();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.UseModules();
app.MapWolverineEndpoints(opts =>
{
    opts.RequireAuthorizeOnAll();
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapDefaultEndpoints();

app.Run();