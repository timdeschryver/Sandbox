using Sandbox.ApiService;
using Sandbox.ServiceDefaults;
using Sandbox.SharedKernel.FeatureFlags;
using Sandbox.SharedKernel.Modules;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddSecurity();
builder.AddAuthentication();
builder.AddOpenApi();
builder.AddErrorHandling();
builder.AddCaching();
builder.AddFeatureFlags();
builder.AddWolverine();
builder.AddModules();

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.UseModules();
app.UseSecurityHeaders();

if (app.Environment.IsDevelopment())
{
    _ = app.MapOpenApi();
    _ = app.MapScalarApiReference("api-docs", options =>
    {
        _ = options.WithTitle("Sandbox API");
    });
}

app.MapDefaultEndpoints();

app.Run();
