# Copilot Instructions

## Core Commands

### Build & Development

- **Start development**: `dotnet run --project ./Sandbox.AppHost` (starts entire Aspire application)
- **Build Angular**: `pnpm --filter="sandbox.angular-workspace" build`
- **Watch Angular**: `pnpm --filter="sandbox.angular-workspace" watch`
- **Start Angular dev**: `pnpm --filter="sandbox.angular-workspace" start` (uses run-script-os for cross-platform)

### Testing

- **Run all .NET tests**: `dotnet test`
- **Run all frontend tests**: `pnpm run -r test` (runs tests across all workspace projects)
- **Run Angular tests**: `pnpm --filter="sandbox.angular-workspace" test` (uses Vitest)
- **Run E2E tests**: `pnpm --filter="sandbox.e2e" test` (uses Playwright)
- **E2E tests with UI**: `pnpm --filter="sandbox.e2e" test:ui`
- **Single test file**: Use VS Code Test Explorer or `dotnet test --filter` for .NET

### Linting & Formatting

- **Lint Angular**: `pnpm --filter="sandbox.angular-workspace" lint`
- **Lint E2E**: `pnpm --filter="sandbox.e2e" lint`
- **Format all**: `pnpm prettier --write .` (from root)

### Database Operations

- **Run migrations**: Available via Aspire dashboard HTTP command "Reset Database"
- **EF migrations**: `dotnet ef migrations add <name>` in relevant module project

### Deployment

- **Deploy to Azure**: `azd up` (requires Azure Developer CLI)
- **Initialize Azure**: `azd init`

## Architecture Overview

### High-Level Structure

- **Monorepo**: .NET backend + Angular frontend with shared tooling
- **Domain-Driven Design**: Modular monolith with separate domain modules
- **BFF Pattern**: API Gateway handles authentication and proxies to backend services
- **Aspire Orchestration**: Local development and deployment orchestration

### Major Components

#### Backend (.NET 10 RC)

- **`Sandbox.AppHost`**: Aspire application host for service orchestration
- **`Sandbox.Gateway`**: YARP-based API gateway with BFF authentication (Auth0 OIDC)
- **`Sandbox.ApiService`**: Main API service with 2 replicas
- **`Sandbox.Migrations`**: Database migration service
- **`Sandbox.ServiceDefaults`**: Shared service configurations

#### Domain Modules

- **`Sandbox.Modules.CustomerManagement`**: Customer domain with billing/shipping addresses
- **`Sandbox.Modules.Billing`**: Billing domain module
- **`Sandbox.SharedKernel`**: Domain primitives, strongly-typed IDs (Vogen), common utilities

#### Frontend (Angular 20)

- **`Sandbox.AngularWorkspace`**: Angular workspace with multiple projects
  - `sandbox-app`: Main application
  - `form-validation-lib`: Form validation library
  - `opentelemetry-lib`: OpenTelemetry instrumentation library

#### Testing Projects

- **`Sandbox.Architectural.Tests`**: Architecture compliance tests (ArchUnitNET)
- **`Sandbox.IntegrationTests`**: Service integration tests (TUnit)
- **`Sandbox.EndToEndTests`**: Playwright E2E tests with Auth0 authentication
- **`Sandbox.Modules.*.Tests`**: Unit tests for each module (TUnit)

### Data Stores

- **Primary Database**: PostgreSQL (with option to switch to SQL Server)
- **Session Storage**: Distributed memory cache for authentication
- **Monitoring**: OpenTelemetry collector for metrics, traces, and logs

### External Services

- **Auth0**: OIDC identity provider (`td-sandbox.eu.auth0.com`)
- **Azure**: Deployment target via Azure Developer CLI

## Style Rules & Standards

### .NET Code Style

- **Testing Framework**: TUnit (not xUnit or NUnit)
- **Test Naming**: Don't use "should" in test method names
- **Test Structure**: Flat tests (no `describe` blocks), avoid `beforeEach`/`afterEach`
- **Domain Classes**: Must have default constructors for EF Core
- **Dependencies**: Use `Directory.Packages.props` for centralized package management
- **Architecture**: Domain layer only depends on itself and strongly-typed IDs

### Angular Code Style

- **Testing**: Vitest + Angular Testing Library (not Jasmine/Karma)
- **Signals**: Prefer signals for reactive state management
- **Forms**: Prefer template-driven forms over reactive forms
- **Accessibility**: Always consider from the start, use semantic HTML
- **Structure**: Flat folder structure, keep files close to usage
- **HTTP**: Use `httpResource` for data fetching with caching
- **Error Handling**: Signal-based error states

### TypeScript/JavaScript

- **Package Manager**: pnpm (not npm/yarn)
- **ESLint**: Flat config with TypeScript ESLint, Prettier integration
- **Node**: Requires Node.js 22+, pnpm 10+

### General Conventions

- **Comments**: English only, clarify non-obvious logic
- **Flat Structure**: Keep related files close together
- **Test Coverage**: Always provide tests for changes
- **Magic Values**: Avoid in tests, use meaningful constants

## Authentication Flow (BFF Pattern)

### User Authentication

1. **Login**: `/bff/login` → Auth0 OIDC flow
2. **Session**: HTTP-only cookies (`__Sandbox`) with server-side token storage
3. **API Calls**: Gateway automatically adds Bearer tokens to backend requests
4. **Logout**: `/bff/logout` → clears both cookie and OIDC sessions

### Security Features

- **CSRF Protection**: Custom antiforgery tokens via YARP transformers
- **Cookie Security**: `SameSite=Strict`, `SecurePolicy=Always`
- **Token Management**: Automatic refresh handled by `GetUserAccessTokenAsync()`

## Secret Management

### SOPS Integration

- **Encrypted Config**: `config/appsettings.encrypted.json`
- **Decrypt**: `sops --decrypt "config/appsettings.encrypted.json" > "Sandbox.AppHost/appsettings.json"`
- **Encrypt**: `sops --encrypt "Sandbox.AppHost/appsettings.json" > "config/appsettings.encrypted.json"`
- **Pattern**: Only fields matching `Secret|Password|Key|Token` are encrypted

## Development Workflow

### Prerequisites

- .NET 10 Preview RC
- Node.js 22+, pnpm 10+
- Container tool (Docker/Podman)
- Azure CLI (for deployment)

### Local Development

1. Start with `dotnet run --project ./Sandbox.AppHost`
2. Access Aspire dashboard for service monitoring
3. Use gateway URL for Angular app (proxies to backend)
4. Monitor OpenTelemetry traces in real-time

### Testing Strategy

- **Unit Tests**: TUnit for .NET, Vitest for Angular
- **Integration Tests**: TUnit with TestContainers for database
- **E2E Tests**: Playwright with Auth0 authentication
- **Architecture Tests**: ArchUnitNET for compliance validation
