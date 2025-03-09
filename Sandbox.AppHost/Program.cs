using Microsoft.Extensions.DependencyInjection;
using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

var secrets =
    builder.ExecutionContext.IsPublishMode
        ? builder.AddAzureKeyVault("key-vault")
        : builder.AddConnectionString("key-vault");

var otel = builder.AddOpenTelemetryCollector();

var sql = builder.AddSqlServer("sql")
    .WithDataVolume();

var db = sql.AddDatabase("database");

builder.AddProject<Projects.Sandbox_ApiService_Migrations>("migrations")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpCommand("/reset-db", "Reset Database", iconName: "DatabaseLightning");

var apiService = builder.AddProject<Projects.Sandbox_ApiService>("apiservice")
    .WithReplicas(2)
    .WithReference(db)
    .WaitFor(db);

var angularApplication = builder
    .AddNpmApp("angularfrontend", "../Sandbox.AngularApp")
    .WithHttpEndpoint(env: "PORT")
    .PublishAsDockerFile();

var apiGateway = builder.AddProject<Projects.Sandbox_ApiGateway>("apigateway")
    .WithReference(apiService)
    .WithReference(angularApplication)
    .WithReference(otel.Resource.HTTPEndpoint)
    .WithReference(otel.Resource.GRPCEndpoint)
    .WithReference(secrets)
    .WithExternalHttpEndpoints();

builder.Build().Run();
