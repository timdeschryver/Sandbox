using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var otel = builder.AddOpenTelemetryCollector();

var sql = builder.AddSqlServer("sql")
    .WithDataVolume();

var db = sql.AddDatabase("database");

builder.AddProject<Projects.Sandbox_ApiService_Migrations>("migrations")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpCommand("/reset-db", "Reset Database", iconName: "DatabaseLightning");

var cache = builder.AddRedis("cache");

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
    .WithExternalHttpEndpoints();

builder.AddProject<Projects.Sandbox_Web>("blazorfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiGateway)
    .WaitFor(apiGateway);

builder.Build().Run();
