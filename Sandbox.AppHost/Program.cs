using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var secrets =
    builder.ExecutionContext.IsPublishMode
        ? builder.AddAzureKeyVault("key-vault")
        : builder.AddConnectionString("key-vault");

var openTelemetryCollector = builder.AddOpenTelemetryCollector("../config/otel.yml");

// Uncomment to use SQL Server instead of PostgreSQL
// var sql = builder.AddSqlServer("sql")
//     .WithDataVolume();
// var db = sql.AddDatabase("sandbox-db");

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin()
    .WithPgWeb();
var db = postgres.AddDatabase("sandbox-db");

var migrations = builder.AddProject<Projects.Sandbox_Migrations>("migrations")
    .WithReference(db)
    .WaitFor(postgres)
    .WaitFor(db);

if (builder.Environment.IsDevelopment())
{
    migrations.WithHttpCommand(path: "/reset-db", displayName: "Reset Database", commandOptions: new HttpCommandOptions
    {
        IconName = "DatabaseLightning",
    });
}

var apiService = builder.AddProject<Projects.Sandbox_ApiService>("apiservice")
    .WithReplicas(2)
    .WithReference(secrets)
    .WithReference(db)
    .WaitFor(db)
    .WaitFor(migrations);

var angularApplication = builder
    .AddNpmApp("angularfrontend", "../Sandbox.AngularWorkspace")
    .WithHttpEndpoint(env: "PORT")
    .WithEnvironment("APPLICATION", "sandbox-app")
    .PublishAsDockerFile(configure: resource =>
    {
        resource.WithDockerfile("../", stage: "sandbox-app");
    });

var gateway = builder.AddProject<Projects.Sandbox_Gateway>("gateway")
    .WithReference(apiService)
    .WithReference(angularApplication)
    .WithReference(openTelemetryCollector.Resource.HTTPEndpoint)
    .WithReference(secrets)
    .WaitFor(apiService)
    .WaitFor(angularApplication)
    .WaitFor(openTelemetryCollector)
    .WithExternalHttpEndpoints();

builder.AddDockerComposePublisher();
#pragma warning disable ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
builder.AddAzurePublisher();
#pragma warning restore ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

builder.Build().Run();
