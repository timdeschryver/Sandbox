using Aspire.Hosting.Azure;
using Microsoft.Extensions.Hosting;
using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var authDomain = builder.AddParameter("OpenIDConnectSettingsDomain", secret: false);
var authClientId = builder.AddParameter("OpenIDConnectSettingsClientId", secret: false);
var authClientSecret = builder.AddParameter("OpenIDConnectSettingsClientSecret", secret: true);
var authAudience = builder.AddParameter("OpenIDConnectSettingsAudience", secret: false);

var prometheus = builder.AddContainer("prometheus", "prom/prometheus")
    .WithBindMount("../config/prometheus", "/etc/prometheus", isReadOnly: true)
    .WithArgs("--web.enable-otlp-receiver", "--config.file=/etc/prometheus/prometheus.yml")
    .WithHttpEndpoint(targetPort: 9090, name: "http");

var grafana = builder.AddContainer("grafana", "grafana/grafana")
    .WithBindMount("../config/grafana/config", "/etc/grafana", isReadOnly: true)
    .WithBindMount("../config/grafana/dashboards", "/var/lib/grafana/dashboards", isReadOnly: true)
    .WithEnvironment("PROMETHEUS_ENDPOINT", prometheus.GetEndpoint("http"))
    .WithHttpEndpoint(targetPort: 3000, name: "http");

var openTelemetryCollector = builder.AddOpenTelemetryCollector("../config/otel.yml")
    .WithEnvironment("PROMETHEUS_ENDPOINT", $"{prometheus.GetEndpoint("http")}/api/v1/otlp"); ;

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
    .WithReference(db)
    .WithEnvironment("OpenIDConnectSettings__Domain", authDomain)
    .WithEnvironment("OpenIDConnectSettings__Audience", authAudience)
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
    .WithEnvironment("OpenIDConnectSettings__Domain", authDomain)
    .WithEnvironment("OpenIDConnectSettings__ClientId", authClientId)
    .WithEnvironment("OpenIDConnectSettings__ClientSecret", authClientSecret)
    .WithEnvironment("OpenIDConnectSettings__Audience", authAudience)
    .WaitFor(apiService)
    .WaitFor(angularApplication)
    .WaitFor(openTelemetryCollector)
    .WithExternalHttpEndpoints();

if (builder.Environment.IsDevelopment())
{
    var playwright = builder
        .AddNpmApp("playwright", "../Sandbox.EndToEndTests", "test")
        .WithExplicitStart()
        .ExcludeFromManifest()
        .WithEnvironment("ASPIRE", "true")
        .WithReference(gateway);
}

builder.AddDockerComposeEnvironment("Sandbox");
#pragma warning disable ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
builder.AddAzureEnvironment();
#pragma warning restore ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

builder.Build().Run();
