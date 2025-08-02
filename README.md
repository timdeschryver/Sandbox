# .NET and Angular Sandbox

Some buzzwords that are used:

- Aspire
- .NET (Minimal) API
  - EF Core Migrations
- Angular
- OpenTelemetry
- YARP
- Containers
- Azure Developer CLI (azd)
- Authentication (WIP)

```mermaid
graph TD
    User["Browser (User)"] --> Gateway

    subgraph "External Facing Components"
        Gateway["API Gateway (YARP)<br>Sandbox.Gateway"]
        Auth0["Auth0<br>Authentication Provider"]
    end

    subgraph "Internal Components"
        AngularApp["Angular Frontend<br>Sandbox.AngularWorkspace"]
        ApiService["API Service<br>Sandbox.ApiService<br>[x2 replicas]"]
        SqlDatabase["SQL Server Database"]
        DbMigrations["Database Migrations<br>Sandbox.ApiService.Migrations"]

        Gateway --> AngularApp
        Gateway --> ApiService
        ApiService --> SqlDatabase
        SqlDatabase -.-o DbMigrations
        Gateway -.-> Auth0
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
    classDef secrets fill:#9cf,stroke:#333,stroke-width:1px;
    classDef auth fill:#f99,stroke:#333,stroke-width:1px;
    classDef monitoring fill:#ffd,stroke:#333,stroke-width:1px;

    class Gateway gateway,externalFacing;
    class Auth0 auth,externalFacing;
    class AngularApp frontend;
    class ApiService backend;
    class SqlDatabase,DbMigrations database;
    class OpenTelemetry monitoring;
```

## Prerequisites

- [.NET 10](https://dotnet.microsoft.com/en-us/download)
- [`pnpm`](https://pnpm.io/)
- Containerization tool ([podman](https://podman.io/), [docker](https://www.docker.com/products/docker-desktop/), etc)

## Secret Management with SOPS

The project uses [SOPS (Secrets Operations)](https://github.com/getsops/sops) to encrypt sensitive configuration values:

- **Encrypted Configuration**: `appsettings.encrypted.json` files contain encrypted secrets
- **Selective Encryption**: Only fields matching secret patterns (Secret, Password, Key, Token) are encrypted
- **Development Friendly**: Non-sensitive configuration remains in plain text for easy reading

### SOPS Quick Start

```powershell
sops --decrypt "config/appsettings.encrypted.json" > "Sandbox.AppHost/appsettings.json"
sops --encrypt "Sandbox.AppHost/appsettings.json" > "config/appsettings.encrypted.json"
```

## Run the project locally

Clone the project and run the `dotnet run` command in the root folder to start the project.

```bash
dotnet run --project ./Sandbox.AppHost
```

## Result

While the project runs you should see the Aspire dashboard.
The first time this can take a while to spin up the containers and download the images.

[![Aspire dashboard](./other/dashboard.png)](./other/dashboard.png)

Navigating to the gateway opens the Angular app, which invokes the .NET API.
Interacting with the application generates traces that are sent to the Aspire dashboard, which can be looked at in real-time through the "Traces" tab in the dashboard.

[![Trace](./other/trace.png)](./other/trace.png)

With the corresponding logs for the traces.

[![Logs](./other/logs.png)](./other/logs.png)

## Deploy to Azure

To deploy the project, make sure you have an Azure subscription and [`azd` installed](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows).

Then, run the following commands to provision the resources and deploy the project:

```bash
azd init
azd up
```
