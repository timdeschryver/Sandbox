using Sandbox.ApiService;
using Sandbox.ServiceDefaults;
using Sandbox.SharedKernel.Modules;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddAuthentication();
builder.AddOpenApi();
builder.AddErrorHandling();
builder.AddCaching();
builder.AddWolverine();
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
    app.MapScalarApiReference("api-docs", options =>
    {
        options.WithTitle("Sandbox API");
    });
}

app.MapDefaultEndpoints();

app.Run();
