using Aspire.Hosting.Azure;
using Microsoft.Extensions.Hosting;
using Sandbox.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var openIDConnectSettingsClientSecret = builder.AddParameter("OpenIDConnectSettingsClientSecret", secret: true);
var keycloakAdminUsername = builder.AddParameter("KeycloakAdminUsername");
var keycloakAdminPassword = builder.AddParameter("KeycloakAdminPassword", secret: true);

var keycloak = builder.AddKeycloak("keycloak", adminUsername: keycloakAdminUsername, adminPassword: keycloakAdminPassword)
    .WithDataVolume()
    .WithEnvironment("KC_HEALTH_ENABLED", "true")
    .WithEnvironment("KC_METRICS_ENABLED", "true")
    .WithRealmImport("../config/keycloak/realms");
openIDConnectSettingsClientSecret.WithParentRelationship(keycloak);
keycloakAdminUsername.WithParentRelationship(keycloak);
keycloakAdminPassword.WithParentRelationship(keycloak);

var minioUser = builder.AddParameter("MinioUser", secret: false);
var minioPassword = builder.AddParameter("MinioPassword", secret: true);

var minio = builder.AddMinioContainer("minio", minioUser, minioPassword)
    .WithEnvironment("MINIO_PROMETHEUS_AUTH_TYPE", "public")
    .WithDataVolume();
minioUser.WithParentRelationship(minio);
minioPassword.WithParentRelationship(minio);

var minioBucketCreator = builder
    .AddContainer("minio-bucket-creator", "minio/mc")
    .WaitFor(minio)
    .WithEnvironment("MinioUser", minioUser)
    .WithEnvironment("MinioPassword", minioPassword)
    .WithEntrypoint("/bin/sh")
    .WithArgs("-c", $" /usr/bin/mc alias set myminio http://{minio.Resource.Name}:9000 $MinioUser $MinioPassword; /usr/bin/mc mb myminio/loki; /usr/bin/mc anonymous set public myminio/loki; /usr/bin/mc mb myminio/tempo;  /usr/bin/mc anonymous set public myminio/tempo; exit 0;");
minioBucketCreator.WithParentRelationship(minio);

var loki = builder.AddContainer("loki", "grafana/loki")
    .WithBindMount("../config/loki", "/etc/loki", isReadOnly: true)
    .WithVolume("loki-data", "/loki")
    .WithArgs("--config.file=/etc/loki/loki.yml", "--config.expand-env=true")
    .WithEnvironment("MINIO_USER", minioUser)
    .WithEnvironment("MINIO_PASSWORD", minioPassword)
    .WithHttpEndpoint(targetPort: 3100, name: "http")
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayLocation = UrlDisplayLocation.DetailsOnly;
    })
    .WaitFor(minio)
    .WaitForCompletion(minioBucketCreator);

var tempo = builder
    .AddContainer("tempo", "grafana/tempo")
    .WithBindMount("../config/tempo", "/etc/tempo", isReadOnly: true)
    .WithVolume("tempo-data", "/var/tempo")
    .WithArgs("--config.file=/etc/tempo/tempo.yml", "--config.expand-env=true", "chown 10001:10001 /var/tempo")
    .WithEnvironment("MINIO_USER", minioUser)
    .WithEnvironment("MINIO_PASSWORD", minioPassword)
    .WithEndpoint(targetPort: 4317, port: 4007, name: "otlp", scheme: "http")
    .WithUrlForEndpoint("otlp", url =>
    {
        url.DisplayLocation = UrlDisplayLocation.DetailsOnly;
    })
    .WithEndpoint(targetPort: 3200, port: 3200, name: "http", scheme: "http")
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayLocation = UrlDisplayLocation.DetailsOnly;
    })
    .WaitFor(minio)
    .WaitForCompletion(minioBucketCreator);

var prometheus = builder.AddContainer("prometheus", "prom/prometheus")
    .WithBindMount("../config/prometheus", "/etc/prometheus", isReadOnly: true)
    .WithArgs("--web.enable-otlp-receiver", "--web.enable-remote-write-receiver", "--enable-feature=native-histograms", "--config.file=/etc/prometheus/prometheus.yml")
    .WithHttpEndpoint(targetPort: 9090, name: "http");

var blackbox = builder
    .AddContainer("blackbox", "prom/blackbox-exporter")
    .WithBindMount("../config/blackbox", "/etc/blackbox/")
    .WithArgs("--config.file=/etc/blackbox/blackbox.yml")
    .WithEndpoint(targetPort: 9115, port: 9115, name: "http", scheme: "http");

var grafanaContainer = builder.AddContainer("grafana", "grafana/grafana");
var grafana = grafanaContainer
    .WithBindMount("../config/grafana/config", "/etc/grafana", isReadOnly: true)
    .WithBindMount("../config/grafana/dashboards", "/var/lib/grafana/dashboards", isReadOnly: true)
    .WithEnvironment("PROMETHEUS_ENDPOINT", prometheus.GetEndpoint("http"))
    .WithEnvironment("LOKI_ENDPOINT", loki.GetEndpoint("http"))
    .WithEnvironment("TEMPO_URL", tempo.GetEndpoint("http"))
    .WithEnvironment("GF_AUTH_ANONYMOUS_ENABLED", "true")
    .WithEnvironment("GF_AUTH_ANONYMOUS_ORG_ROLE", "Admin")
    .WithEnvironment("GF_AUTH_DISABLE_LOGIN_FORM", "true")
    .WithVolume(VolumeNameGenerator.Generate(grafanaContainer, "data"), "/var/lib/grafana")
    .WithHttpEndpoint(targetPort: 3000, name: "http")
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Open Grafana Dashboard";
    });

loki.WithParentRelationship(grafana);
tempo.WithParentRelationship(grafana);
prometheus.WithParentRelationship(grafana);
blackbox.WithParentRelationship(grafana);

var openTelemetryCollector = builder.AddOpenTelemetryCollector("../config/otel.yml")
    .WithEnvironment("PROMETHEUS_ENDPOINT", $"{prometheus.GetEndpoint("http")}/api/v1/otlp")
    .WithEnvironment("LOKI_ENDPOINT", $"{loki.GetEndpoint("http")}/otlp")
    .WithEnvironment("TEMPO_URL", $"{tempo.GetEndpoint("otlp")}");

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin()
    .WithPgWeb();

var database = postgres.AddDatabase("sandbox-db");

var migrations = builder.AddProject<Projects.Sandbox_Migrations>("migrations")
    .WithReference(database)
    .WaitFor(database)
    .WithParentRelationship(database);

if (builder.Environment.IsDevelopment())
{
    migrations.WithHttpCommand(path: "/reset-db", displayName: "Reset Database", commandOptions: new HttpCommandOptions
    {
        IconName = "DatabaseLightning",
        ConfirmationMessage = "Are you sure you want to reset the database?",
    });
}

var apiService = builder.AddProject<Projects.Sandbox_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WithReference(database)
    .WithReference(keycloak)
    .WaitFor(database)
    .WaitFor(migrations)
    .WaitFor(keycloak)
    .WithUrls(context =>
    {
        context.Urls.Add(new() { Url = "/scalar", DisplayText = "OpenAPI Specification", Endpoint = context.GetEndpoint("http") });
    });

var angularApplication = builder
    .AddJavaScriptApp("angular-frontend", "../Sandbox.AngularWorkspace", runScriptName: "start")
    .WithPnpm(install: true, installArgs: ["--frozen-lockfile"])
    .WithRunScript("start")
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
    .WithReference(keycloak)
    .WithEnvironment("OpenIDConnectSettings__ClientSecret", openIDConnectSettingsClientSecret)
    .WaitFor(apiService)
    .WaitFor(angularApplication)
    .WaitFor(openTelemetryCollector)
    .WaitFor(keycloak)
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Open application";
    })
    .WithExternalHttpEndpoints();

apiService.WithParentRelationship(gateway);
angularApplication.WithParentRelationship(gateway);
keycloak.WithParentRelationship(gateway);

if (builder.Environment.IsDevelopment())
{
    var playwright = builder
        .AddJavaScriptApp("playwright", "../Sandbox.EndToEndTests")
        .WithPnpm(install: false)
        .WithRunScript("test")
        .WithExplicitStart()
        .WithPlaywrightRepeatCommand()
        .ExcludeFromManifest()
        .WithEnvironment("ASPIRE", "true")
        .WithReference(gateway)
        .WithReference(migrations)
        .WithParentRelationship(angularApplication);
}

var dabServer = builder
    .AddContainer("data-api", image: "azure-databases/data-api-builder", tag: "1.7.83-rc")
    .WithImageRegistry("mcr.microsoft.com")
    .WithBindMount(source: new FileInfo("dab-config.json").FullName, target: "/App/dab-config.json", isReadOnly: true)
    .WithHttpEndpoint(port: 5000, targetPort: 5000)
    .WithUrls(context =>
    {
        context.Urls.Clear();
        context.Urls.Add(new() { Url = "/graphql", DisplayText = "Nitro", Endpoint = context.GetEndpoint("http") });
        context.Urls.Add(new() { Url = "/swagger", DisplayText = "Swagger", Endpoint = context.GetEndpoint("http") });
        context.Urls.Add(new() { Url = "/", DisplayText = "Health", Endpoint = context.GetEndpoint("http") });
    })
    .WithOtlpExporter()
    .WithHttpHealthCheck("/")
    .WithEnvironment("DAB_ENVIRONMENT", builder.Environment.IsDevelopment() ? "development" : "production")
    .WithEnvironment("ConnectionString", database)
    .WaitFor(database)
    .WaitFor(migrations);

builder.AddDockerComposeEnvironment("Sandbox")
    .WithDashboard(false);

#pragma warning disable ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
builder.AddAzureEnvironment();
#pragma warning restore ASPIREAZURE001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

await builder.Build().RunAsync();
