using JasperFx.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi;
using Sandbox.ApiService;
using Sandbox.ServiceDefaults;
using Sandbox.SharedKernel.Modules;
using Scalar.AspNetCore;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddKeycloakJwtBearer(
        serviceName: "keycloak",
        realm: "sandbox",
        configureOptions: options =>
        {
            options.Audience = "sandbox.api";
            if (builder.Environment.IsDevelopment())
            {
                options.RequireHttpsMetadata = false;
            }
        });

builder.Services.AddAuthorization();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi(openApi =>
{
    openApi.AddDocumentTransformer((document, _, _) =>
    {
        document.Servers = [new OpenApiServer { Url = "https://localhost:7333" }];
        document.Info = new OpenApiInfo
        {
            Title = "Sandbox API Reference",
            Version = "v1",
            Description = "This is a sample API for the Sandbox project.",
            Contact = new OpenApiContact
            {
                Name = "Support",
                Email = "contact@timdeschryver.dev",
                Url = new Uri("https://github.com/timdeschryver/sandbox")
            },
        };
        return Task.CompletedTask;
    });
    openApi.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder.Services.AddResourceSetupOnStartup();
builder.Host.UseWolverine(opts =>
{
    // Needed to generate the OpenAPI document, otherwise this exception is thrown
    if (Environment.GetCommandLineArgs().Any(e => e.Contains("GetDocument.Insider", StringComparison.OrdinalIgnoreCase)))
    {
        return;
    }
    var connectionString = builder.Configuration.GetConnectionString("sandbox-db") ?? throw new InvalidOperationException("Connection string 'sandbox-db' not found.");
    opts.PersistMessagesWithPostgresql(connectionString, "wolverine");
    opts.UseEntityFrameworkCoreTransactions();
    opts.MultipleHandlerBehavior = MultipleHandlerBehavior.Separated;
    opts.Durability.MessageIdentity = MessageIdentity.IdAndDestination;
    opts.Policies.UseDurableLocalQueues();
    opts.Policies.AutoApplyTransactions();
});

builder.AddModules();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.UseModules();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("Sandbox API");
    });
}

app.MapDefaultEndpoints();

app.Run();
