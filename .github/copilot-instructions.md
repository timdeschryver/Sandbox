# Critical System Understanding: Sandbox Application

The Sandbox Application is a monorepo containing an a .NET backend and a Angular frontend. It has a comprehensive testing strategy including unit, integration, architecture, and end-to-end tests.

## Architecture Foundation

**Monorepo**: All backend and frontend code lives in a single repository, enabling easier cross-team collaboration, consistent tooling, and simplified dependency management.

**Modular Monolith** + DDD: Clear bounded contexts. Each module implements IModule with separate schemas, DbContexts, and caching strategies. Always use TUnit for testing.

**BFF Pattern**: Gateway uses YARP to proxy requests, managing authentication server-side. Frontend never touches tokens—only HttpOnly cookies. The gateway automatically transforms cookies to Bearer tokens for API calls.

**Angular Frontend**: Modern Angular 21 app using standalone components, signals, and signal forms. Always Vitest for testing.

**Aspire Orchestration**: Aspire hosts the modular monolith, managing service lifecycles, configurations, and dependencies.

**Observability**: OpenTelemetry collector for metrics, traces, and logs across backend and frontend. Grafana (with loki, tempo, blackbox, prometheus) dashboards for visualization.

### System Architecture

The application follows a modular monolith architecture hosted by .NET Aspire with a BFF (Backend for Frontend) pattern for secure authentication:

```mermaid
graph TB
    subgraph "External Services"
        Keycloak[Keycloak<br/>Identity Provider]
    end

    subgraph "Aspire Orchestration"
        AppHost[Sandbox.AppHost<br/>Aspire Host]

        subgraph "Frontend Layer"
            Angular[Angular App<br/>Standalone Components<br/>Signals & Signal Forms]
        end

        subgraph "Gateway Layer - BFF Pattern"
            Gateway[Sandbox.Gateway<br/>YARP Reverse Proxy<br/>Cookie → Bearer Token]
        end

        subgraph "API Layer"
            ApiService[Sandbox.ApiService<br/>Modular Monolith]

            subgraph "Domain Modules"
                CustomerMgmt[CustomerManagement<br/>Module]
                Billing[Billing<br/>Module]
            end
        end

        subgraph "Data Layer"
            Migrations[Sandbox.Migrations<br/>EF Core Migrations]
            Postgres[(PostgreSQL<br/>Modular Schemas)]
            Redis[(Redis<br/>Distributed Cache<br/>FusionCache L2)]
        end

        subgraph "Observability"
            OTel[OpenTelemetry<br/>Collector]
            Grafana[Grafana Stack<br/>Loki, Tempo<br/>Prometheus]
        end
    end

    subgraph "Shared Libraries"
        SharedKernel[SharedKernel<br/>Vogen Value Objects<br/>Messages & Utilities]
        ServiceDefaults[ServiceDefaults<br/>Common Configs]
    end

    User([User]) -->|HTTPS| Angular
    Angular -->|HttpOnly Cookies| Gateway
    Gateway -->|OIDC/OAuth2| Keycloak
    Gateway -->|Bearer Token| ApiService

    ApiService --> CustomerMgmt
    ApiService --> Billing
    CustomerMgmt --> Postgres
    Billing --> Postgres
    CustomerMgmt -.->|L1/L2 Cache| Redis
    Billing -.->|L1/L2 Cache| Redis

    Migrations -->|Apply Migrations| Postgres

    ApiService -.->|Traces/Metrics/Logs| OTel
    Gateway -.->|Traces/Metrics/Logs| OTel
    Angular -.->|Traces/Metrics/Logs| OTel
    OTel --> Grafana

    AppHost -.->|Orchestrates| Gateway
    AppHost -.->|Orchestrates| ApiService
    AppHost -.->|Orchestrates| Angular
    AppHost -.->|Orchestrates| Migrations
    AppHost -.->|Orchestrates| Postgres
    AppHost -.->|Orchestrates| Redis
    AppHost -.->|Orchestrates| OTel

    CustomerMgmt -.->|Uses| SharedKernel
    Billing -.->|Uses| SharedKernel
    ApiService -.->|Uses| ServiceDefaults
    Gateway -.->|Uses| ServiceDefaults

    style User fill:#e1f5ff
    style Keycloak fill:#fff4e1
    style Angular fill:#dd0031,color:#fff
    style Gateway fill:#512bd4,color:#fff
    style ApiService fill:#512bd4,color:#fff
    style CustomerMgmt fill:#68217a,color:#fff
    style Billing fill:#68217a,color:#fff
    style Postgres fill:#336791,color:#fff
    style Redis fill:#dc382d,color:#fff
    style OTel fill:#f5a800
    style Grafana fill:#f46800,color:#fff
```

**Key Architectural Decisions:**

- **Aspire Orchestration**: Single command (`dotnet run --project ./Sandbox.AppHost`) starts entire stack
- **BFF Pattern**: Gateway handles authentication, transforms cookies to Bearer tokens
- **Modular Monolith**: Each module has its own DbContext, schema, and bounded context
- **Security-First**: Tokens never exposed to frontend, only secure HttpOnly cookies
- **Observability-Ready**: OpenTelemetry integrated at all layers

### Request Flow

The following diagram illustrates how a typical authenticated API request flows through the system using the BFF pattern:

```mermaid
sequenceDiagram
    actor User
    participant Browser as Angular App<br/>(Browser)
    participant Gateway as Sandbox.Gateway<br/>(YARP BFF)
    participant Keycloak as Keycloak<br/>(Identity Provider)
    participant API as Sandbox.ApiService<br/>(Modular Monolith)
    participant Module as Domain Module<br/>(e.g., CustomerManagement)
    participant DB as PostgreSQL
    participant Cache as Redis<br/>(FusionCache)
    participant OTel as OpenTelemetry<br/>Collector

    Note over User,OTel: Initial Authentication Flow
    User->>Browser: Navigate to app
    Browser->>Gateway: Request page
    Gateway->>Gateway: Check authentication
    Gateway-->>Browser: Redirect to Keycloak
    Browser->>Keycloak: Login request
    User->>Keycloak: Enter credentials
    Keycloak-->>Gateway: Authorization code
    Gateway->>Keycloak: Exchange code for tokens
    Keycloak-->>Gateway: Access + Refresh tokens
    Gateway->>Gateway: Store tokens securely
    Gateway-->>Browser: Set HttpOnly Cookie
    Browser-->>User: Show authenticated app

    Note over User,OTel: Authenticated API Request Flow
    User->>Browser: Trigger action (e.g., Get Customer)
    Browser->>Gateway: GET /api/customers/123<br/>(Cookie: session=xxx)

    Gateway->>Gateway: Validate session cookie
    Gateway->>Gateway: Extract Bearer token from session
    Gateway->>Gateway: Apply CSRF protection

    Gateway->>API: GET /api/customers/123<br/>(Authorization: Bearer xxx)

    API->>API: Validate JWT token
    API->>API: Route to module

    API->>Module: Handle request

    Module->>Cache: Check L1 (memory) cache
    alt Cache Hit
        Cache-->>Module: Return cached data
    else Cache Miss
        Module->>Cache: Check L2 (Redis) cache
        alt L2 Cache Hit
            Cache-->>Module: Return cached data
            Module->>Cache: Update L1 cache
        else L2 Cache Miss
            Module->>DB: Query database
            DB-->>Module: Return data
            Module->>Cache: Update L1 + L2 cache
        end
    end

    Module->>Module: Apply business logic
    Module-->>API: Return response

    API->>OTel: Send trace/metrics
    API-->>Gateway: 200 OK + JSON

    Gateway->>OTel: Send trace/metrics
    Gateway-->>Browser: 200 OK + JSON

    Browser->>OTel: Send trace/metrics
    Browser-->>User: Display data

    Note over User,OTel: Token Refresh (When Expired)
    Browser->>Gateway: Request with expired token cookie
    Gateway->>Gateway: Detect token expiration
    Gateway->>Keycloak: Refresh token request
    Keycloak-->>Gateway: New access token
    Gateway->>Gateway: Update stored tokens
    Gateway-->>Browser: Update HttpOnly Cookie
    Gateway->>API: Retry with new Bearer token
    API-->>Gateway: 200 OK
    Gateway-->>Browser: 200 OK
```

**Flow Highlights:**

1. **Authentication**: User logs in via Keycloak, Gateway stores tokens server-side and issues HttpOnly cookies to browser
2. **Cookie-to-Token Transform**: Gateway automatically converts session cookies to Bearer tokens for API calls
3. **CSRF Protection**: Gateway validates anti-forgery tokens via YARP transformers
4. **Hybrid Caching**: FusionCache provides L1 (in-memory) and L2 (Redis) caching with automatic backplane synchronization
5. **Token Refresh**: Gateway handles token refresh transparently without user interaction
6. **Observability**: Every layer emits traces/metrics to OpenTelemetry collector
7. **Security**: Frontend never sees tokens, only cookies; reduces XSS attack surface

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

### Database Schema

The application uses a modular database schema with separate schemas per module:

```mermaid
erDiagram
    %% CustomerManagement Schema (customermanagement)
    CUSTOMER ||--o{ CUSTOMER_BILLING_ADDRESS : has
    CUSTOMER ||--o{ CUSTOMER_SHIPPING_ADDRESS : has

    CUSTOMER {
        uuid Id PK "CustomerId (Vogen)"
        varchar FirstName "Max 255"
        varchar LastName "Max 255"
        timestamp DeletedAt "Nullable, soft delete"
    }

    CUSTOMER_BILLING_ADDRESS {
        uuid Id PK "CustomerAddressId (Vogen)"
        uuid CustomerId FK "Shadow property"
        varchar Street "Max 255"
        varchar City "Max 100"
        varchar ZipCode "Max 20"
        varchar AddressType "Discriminator: 'Billing'"
    }

    CUSTOMER_SHIPPING_ADDRESS {
        uuid Id PK "CustomerAddressId (Vogen)"
        uuid CustomerId FK "Shadow property"
        varchar Street "Max 255"
        varchar City "Max 100"
        varchar ZipCode "Max 20"
        varchar Note "Additional field for shipping"
        varchar AddressType "Discriminator: 'Shipping'"
    }
```

**Key Design Patterns:**

- **Strongly-typed IDs**: CustomerId and CustomerAddressId are Vogen value objects wrapping GUIDs
- **Table-per-Hierarchy (TPH)**: CustomerBillingAddress and CustomerShippingAddress share the `customeraddresses` table with discriminator column `AddressType`
- **Complex Properties**: FullName (FirstName + LastName) and Address (Street, City, ZipCode) are configured as owned types
- **Soft Deletes**: Global query filters automatically exclude entities where DeletedAt is not null
- **Shadow Properties**: Foreign keys like CustomerId are configured as shadow properties (not exposed in entity classes)
- **Modular Schemas**: Each module has its own database schema (customermanagement, billing) for clear bounded contexts

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
