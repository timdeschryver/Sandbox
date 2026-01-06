<div align="center">
  <img src="./other/logo.svg" alt="Sandbox Logo" width="200"/>
  
# .NET and Angular Sandbox

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=925777950)

</div>

Some buzzwords that are used:

- [Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview)
- [.NET (Minimal) API](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview)
    - [EF Core](https://learn.microsoft.com/en-us/ef/core/) (with Migrations)
- [Angular](https://angular.dev/)
- [Redis](https://redis.io/) with [FusionCache](https://github.com/ZiggyCreatures/FusionCache) (distributed hybrid caching with backplane synchronization)
- [OpenTelemetry](https://opentelemetry.io/)
    - [Grafana](https://grafana.com/) Stack ([Tempo](https://grafana.com/docs/tempo/latest/), [Loki](https://grafana.com/docs/loki/latest/))
    - [Prometheus](https://prometheus.io/) (and [Blackbox](https://github.com/prometheus/blackbox_exporter))
- [YARP](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/getting-started)
- Containers
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/) (azd)
- Authentication with [Keycloak](https://www.keycloak.org/)
- Secrets OPerationS ([SOPS](https://github.com/getsops/sops))
- [Renovate](https://docs.renovatebot.com/) for automatic dependency updates
- Testing
    - Angular tests with [Vitest](https://vitest.dev/)
    - .NET unit tests with [TUnit](https://tunit.dev/)
    - .NET integration tests with [Testcontainers](https://testcontainers.com/)
    - End-to-End Testing with [Playwright](https://playwright.dev/)

```mermaid
graph TD
    User["Browser (User)"] --> Gateway

    subgraph "External Facing Components"
        Gateway["API Gateway (YARP)<br>Sandbox.Gateway"]
        Keycloak["Keycloak<br>Authentication Provider"]
    end

    subgraph "Internal Components"
        AngularApp["Angular Frontend<br>Sandbox.AngularWorkspace"]
        ApiService["API Service<br>Sandbox.ApiService<br>"]
        SqlDatabase["SQL Server Database"]
        Redis["Redis Cache<br>FusionCache with Backplane"]
        DbMigrations["Database Migrations<br>Sandbox.ApiService.Migrations"]

        Gateway --> AngularApp
        Gateway --> ApiService
        ApiService --> SqlDatabase
        ApiService --> Redis
        SqlDatabase -.-o DbMigrations
        Gateway -.-> Keycloak
    end

    subgraph "Monitoring"
        OpenTelemetry["OpenTelemetry Collector<br>Metrics, Traces, Logs"]
        Gateway -.-> OpenTelemetry
        AngularApp -.-> OpenTelemetry
        ApiService -.-> OpenTelemetry
        SqlDatabase -.-> OpenTelemetry
    end

    classDef externalFacing fill:#f96,stroke:#333,stroke-width:3px,stroke-dasharray: 5 5;
    classDef gateway fill:#f9f,stroke:#333,stroke-width:2px;
    classDef frontend fill:#bbf,stroke:#333,stroke-width:1px;
    classDef backend fill:#bfb,stroke:#333,stroke-width:1px;
    classDef database fill:#fbb,stroke:#333,stroke-width:1px;
    classDef cache fill:#fcb,stroke:#333,stroke-width:1px;
    classDef secrets fill:#9cf,stroke:#333,stroke-width:1px;
    classDef auth fill:#f99,stroke:#333,stroke-width:1px;
    classDef monitoring fill:#ffd,stroke:#333,stroke-width:1px;

    class Gateway gateway,externalFacing;
    class Keycloak auth,externalFacing;
    class AngularApp frontend;
    class ApiService backend;
    class SqlDatabase,DbMigrations database;
    class Redis cache;
    class OpenTelemetry monitoring;
```

## Prerequisites

- [.NET 10](https://dotnet.microsoft.com/en-us/download)
- [`pnpm`](https://pnpm.io/)
- Containerization tool ([podman](https://podman.io/), [docker](https://www.docker.com/products/docker-desktop/), etc)

> [!NOTE]
> **Windows Long Path Support**
>
> Windows has a default path length limitation of 260 characters that may cause errors during Git operations with this repository (e.g., "Filename too long" errors). To enable long path support, run one of the following commands (see [git config core.longpaths](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corelongpaths)):
>
> **System-wide (requires Administrator privileges):**
>
> ```bash
> git config --system core.longpaths true
> ```
>
> **User-level (no Administrator required):**
>
> ```bash
> git config --global core.longpaths true
> ```

## Secret Management with SOPS

The project uses [SOPS (Secrets Operations)](https://github.com/getsops/sops) to encrypt sensitive configuration values:

- **Encrypted Configuration**: `appsettings.encrypted.json` files contain encrypted secrets
- **Selective Encryption**: Only fields matching secret patterns (Secret, Password, Key, Token) are encrypted
- **Development Friendly**: Non-sensitive configuration remains in plain text for easy reading

### SOPS Quick Start

```powershell
$env:SOPS_AGE_KEY_FILE = "./config/sops/age/keys.txt"
sops --decrypt "config/appsettings.encrypted.json" > "Sandbox.AppHost/appsettings.json"
sops --encrypt "Sandbox.AppHost/appsettings.json" > "config/appsettings.encrypted.json"
```

## Run the project locally

Clone the project and run the `dotnet run` command in the root folder to start the project.

```bash
dotnet run --project ./Sandbox.AppHost
```

## Result

### Aspire dashboard

The Aspire dashboard provides a comprehensive view of all running services, their health status, and resource utilization in the development environment.

![Aspire dashboard showing running services including API Gateway, Angular app, API service, SQL Server database, and Keycloak authentication provider with their respective health statuses and resource metrics](./other/aspire.png)

### Grafana Stack with OpenTelemetry data

The monitoring stack uses Grafana to visualize OpenTelemetry data collected from all services, providing insights into application performance, logs, traces, and health metrics.

![Grafana dashboard displaying application metrics and performance data collected via OpenTelemetry, showing service response times, request rates, and system resource utilization](./other/grafana.png)

![Grafana Loki logs interface showing structured application logs from all services with filtering and search capabilities for debugging and monitoring](./other/logs.png)

![Grafana Tempo distributed tracing view displaying request traces across microservices, showing the complete request flow from gateway through API services to database](./other/traces.png)

![Application health monitoring dashboard showing the status of all services, endpoints, and dependencies with visual indicators for system health](./other/health.png)

### Authentication using Keycloak

Keycloak serves as the identity and access management solution, providing secure authentication and authorization for the application.

![Keycloak admin console interface showing user management, realm settings, and authentication configuration for the Sandbox application](./other/keycloak.png)

### OpenAPI Specification with Scalar

Scalar provides an interactive API documentation interface generated from the OpenAPI specification, allowing developers to explore and test API endpoints.

![Scalar API documentation interface displaying the Sandbox API endpoints with interactive request/response examples, authentication requirements, and detailed parameter documentation](./other/scalar.png)

## Additional Resources

- [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main): A collection of custom instructions, agents, prompts, and skills for GitHub Copilot.

## Deploy to Azure

To deploy the project, make sure you have an Azure subscription and [`azd` installed](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows).

Then, run the following commands to provision the resources and deploy the project:

```bash
azd init
azd up
```
