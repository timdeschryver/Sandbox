using JasperFx.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, jwtOptions =>
    {
        jwtOptions.Authority = $"https://{builder.Configuration["OpenIDConnectSettings:Domain"]}";
        jwtOptions.Audience = builder.Configuration["OpenIDConnectSettings:Audience"];
    });

builder.Services.AddAuthorization();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, _) =>
    {
        document.Info = new()
        {
            Title = "Sandbox API Reference",
            Version = "v1",
            Description = """
                          This is a sample API for the Sandbox project.
                          """,
            Contact = new()
            {
                Name = "Support",
                Email = "doesnotexist@timdeschryver.dev",
                Url = new Uri("https://github.com/timdeschryver/sandbox")
            }
        };
        return Task.CompletedTask;
    });
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

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
