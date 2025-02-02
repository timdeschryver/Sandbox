var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.Sandbox_ApiService>("apiservice")
    .WithReplicas(2);

var apiGateway = builder.AddProject<Projects.Sandbox_ApiGateway>("apigateway")
    .WithReference(apiService);

builder.AddProject<Projects.Sandbox_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiGateway)
    .WaitFor(apiGateway);

builder.Build().Run();
