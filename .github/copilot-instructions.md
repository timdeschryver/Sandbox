# Critical System Understanding: Sandbox Application

The Sandbox Application is a monorepo containing an a .NET backend and a Angular frontend. It has a comprehensive testing strategy including unit, integration, architecture, and end-to-end tests.

## Architecture Foundation

**Monorepo**: All backend and frontend code lives in a single repository, enabling easier cross-team collaboration, consistent tooling, and simplified dependency management.

**Modular Monolith** + DDD: Clear bounded contexts. Each module implements IModule with separate schemas, DbContexts, and caching strategies. Always use TUnit for testing.

**BFF Pattern**: Gateway uses YARP to proxy requests, managing authentication server-side. Frontend never touches tokens—only HttpOnly cookies. The gateway automatically transforms cookies to Bearer tokens for API calls.

**Angular Frontend**: Modern Angular 21 app using standalone components, signals, and signal forms. Always Vitest for testing.

**Aspire Orchestration**: Aspire hosts the modular monolith, managing service lifecycles, configurations, and dependencies.

**Observability**: OpenTelemetry collector for metrics, traces, and logs across backend and frontend. Grafana (with loki, tempo, blackbox, prometheus) dashboards for visualization.

### Technologies

- **Backend**: .NET 10, Entity Framework Core, YARP, Vogen, TUnit, ArchUnitNET.
- **Frontend**: Angular 21, TypeScript, no UI-library, Angular Testing Library, Vitest, Playwright.

## Core Commands

### Development

- **Start development**: `dotnet run --project ./Sandbox.AppHost`

### Build

- **Build .NET**: `dotnet build`
- **Build Angular**: `pnpm --filter="sandbox.angular-workspace" build`

### Test

- **Run all .NET tests**: `dotnet test`
- **Run Angular tests**: `pnpm --filter="sandbox.angular-workspace" test --watch=false --reporters=dot`
- **Run End-to-end tests**: `pnpm --filter="sandbox.e2e" test --reporter=dot`
- **Run all frontend tests**: `pnpm run -r test`

### Lint (and Format)

- **Lint all frontend**: `pnpm -r lint`
- **Format .NET**: `dotnet format --severity info`
- **Format all**: `pnpm prettier --write .`

### Database Operations

- **EF migrations**: `dotnet ef migrations add <name> -project Sandbox.Migrations`.
- Migrations are applied automatically at startup.

### Major Components

#### Backend (.NET)

- **`Sandbox.AppHost`**: Aspire application host for service orchestration
- **`Sandbox.Gateway`**: YARP-based API gateway with BFF authentication (Keycloak)
- **`Sandbox.ApiService`**: Main API service, hosting the different domain modules
- **`Sandbox.Migrations`**: Database migration service
- **`Sandbox.ServiceDefaults`**: Shared service configurations
- **`Sandbox.SharedKernel`**: Domain primitives as value objects (Vogen), shared contracts (messages), common utilities
- **`Directory.Packages.props`**: Centralized package management

#### Domain Modules

- **`Sandbox.Modules.CustomerManagement`**: Customer domain with billing/shipping addresses
- **`Sandbox.Modules.Billing`**: Billing domain module

#### Frontend

- **`Sandbox.AngularWorkspace`**: Angular workspace with multiple projects
    - `sandbox-app`: Main application
    - `form-validation-lib`: Form validation library
    - `opentelemetry-lib`: OpenTelemetry instrumentation library
- **`pnpm-workspace.yaml`**: Use pnpm workspaces with catalogs for package management. For commands, always use `pnpm` at the root level with filters when needed.

#### Testing Projects

- **`Sandbox.Modules.*.Tests`**: Unit tests for each module (TUnit)
- **`Sandbox.IntegrationTests`**: Service integration tests (TUnit) in combination with test containers
- **`Sandbox.EndToEndTests`**: Playwright E2E tests with Keycloak authentication
- **`Sandbox.AngularWorkspace`**: Vitest unit tests for Angular following the syntax `*.spec.ts`
- **`Sandbox.Architectural.Tests`**: Architecture compliance tests (ArchUnitNET)

### Data Stores

- **Primary Database**: PostgreSQL (with option to switch to SQL Server)
- **Distributed Cache**: Redis with FusionCache hybrid L1/L2 caching and backplane for replica synchronization
- **Monitoring**: OpenTelemetry collector for metrics, traces, and logs.

## Security

### User Authentication

- **Identity Provider**: Keycloak
- **BFF Pattern**: with YARP
- **Cookies**: for session management, no tokens in frontend storage
- **Token Management**: Automatic token refresh in BFF layer, not exposed to frontend but used in API projects

### Security Features

- **OWASP Top 10**: Always consider during development ( Broken Access Control, Insecure Design, Mishandling of Exceptional Conditions, etc.)
- **CSRF Protection**: Custom antiforgery tokens via YARP transformers
- **Cookie Security**: Only secure, HttpOnly cookies for session tokens

### Secret Management

Use SOPS for encrypting sensitive configuration files.
When a change is made to the appsettings, always update the encrypted version as well.

- **Encrypted Config**: `config/appsettings.encrypted.json`
- **Decrypt**: `sops --decrypt "config/appsettings.encrypted.json" > "Sandbox.AppHost/appsettings.json"`
- **Encrypt**: `sops --encrypt "Sandbox.AppHost/appsettings.json" > "config/appsettings.encrypted.json"`
- **Pattern**: Only fields matching `Secret|Password|Key|Token` are encrypted
