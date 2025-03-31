using Microsoft.Extensions.DependencyInjection;
using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

var secrets =
    builder.ExecutionContext.IsPublishMode
        ? builder.AddAzureKeyVault("key-vault")
        : builder.AddConnectionString("key-vault");

var openTelemetryCollector = builder.AddOpenTelemetryCollector("../config/otel.yml");

var sql = builder.AddSqlServer("sql")
    .WithDataVolume();

var db = sql.AddDatabase("database");

var migrations = builder.AddProject<Projects.Sandbox_ApiService_Migrations>("migrations")
    .WithReference(db)
    .WaitFor(db)
    .WaitFor(sql)
    .WithHttpCommand("/reset-db", "Reset Database", iconName: "DatabaseLightning");

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

var apiGateway = builder.AddProject<Projects.Sandbox_ApiGateway>("apigateway")
    .WithReference(apiService)
    .WithReference(angularApplication)
    .WithReference(openTelemetryCollector.Resource.HTTPEndpoint)
    .WithReference(secrets)
    .WaitFor(apiService)
    .WaitFor(angularApplication)
    .WaitFor(openTelemetryCollector)
    .WithExternalHttpEndpoints();

builder.Build().Run();
