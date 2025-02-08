using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var otel = builder.AddOpenTelemetryCollector();

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.Sandbox_ApiService>("apiservice")
    .WithReplicas(2);

var angularApplication = builder
    .AddNpmApp("angularfrontend", "../Sandbox.AngularApp")
    .WithHttpEndpoint(env: "PORT")
    .PublishAsDockerFile();

var apiGateway = builder.AddProject<Projects.Sandbox_ApiGateway>("apigateway")
    .WithReference(apiService)
    .WithReference(angularApplication)
    .WithExternalHttpEndpoints();

builder.AddProject<Projects.Sandbox_Web>("blazorfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiGateway)
    .WaitFor(apiGateway);

builder.Build().Run();
