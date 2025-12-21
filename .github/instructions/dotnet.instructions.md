---
description: 'Instructions for .NET code style, architecture, and best practices.'
applyTo: '**/*.cs'
---

# .NET Instructions

## Architecture & Design Patterns

- Entity Framework Core for data access
- Using Domain Driven Design (DDD) principles
- Using the Vertical Slice Architecture
- ASP.NET minimal endpoints as a single file containing the Input and Output
- Wolverine's bus and handlers for asynchronous messaging
- TUnit is used for writing tests
- PostgreSQL is used as database
- Strongly typed ids using `Vogen` to ensure type safety in identifiers
- Aspire for service orchestration

## Core Principles

### Domain-Driven Design (DDD)

- **Ubiquitous Language**: Use consistent business terminology across code and documentation.
- **Bounded Contexts**: Clear service boundaries with well-defined responsibilities.
- **Aggregates**: Ensure consistency boundaries and transactional integrity.
- **Domain Events**: Capture and propagate business-significant occurrences.
- **Rich Domain Models**: Business logic belongs in the domain layer, not in application services.

### .NET Good Practices

- **Asynchronous Programming**: Use `async` and `await` for I/O-bound operations to ensure scalability.
- **Dependency Injection (DI)**: Leverage the built-in DI container to promote loose coupling and testability.
- **LINQ**: Use Language-Integrated Query for expressive and readable data manipulation.
- **Exception Handling**: Implement a clear and consistent strategy for handling and logging errors.
- **Modern C# Features**: Utilize modern language features (e.g., records, pattern matching) to write concise and robust code.

### Security Best Practices

- **Input Validation**: Always validate and sanitize user inputs to prevent injection attacks.
- **Authentication & Authorization**: Protect endpoints using ASP.NET Core Identity.
- **Secure Configuration**: Use secure storage for sensitive configuration (e.g., secrets, connection strings).

### Performance & Scalability

- **Async Operations**: Non-blocking processing with `async`/`await`.
- **Optimized Data Access**: Efficient database queries and indexing strategies using EF Core (e.g., projections, no-tracking queries). Don't write N+1 queries.
- **Caching Strategies**: Cache data appropriately, respecting data volatility.
- **Memory Efficiency**: Properly sized aggregates and value objects.

## Project Organization

### Module Structure

Each module follows DDD structure:

- `Application/` - Use cases (endpoints), handlers
- `Data/` - Entity Framework configurations, repositories, and data access
- `{ModuleName}Module.cs` - Module registration and dependency injection

### Naming Conventions

- Use descriptive names that express intent
- Avoid abbreviations unless they are well-known (e.g., `Id`, `Url`)

## Code Patterns

### Entity Framework

- Use fluent configuration in `IEntityTypeConfiguration<T>` classes
- Keep DbContext focused on data access, avoid business logic
- Use value objects for complex properties
- Use migrations for schema changes

### Wolverine Integration

- Create handlers as classes with `Handle` methods
- Use command/query separation (CQRS)
- Use message routing for cross-module communication

### Dependency Injection

- Register services in module-specific extension methods
- Use `IOptions<T>` for configuration binding

## Logging

- Use structured logging with LoggerMessage delegates (CA1848)

## Testing Guidelines

### Unit Tests with TUnit

- Test one behavior per test method
- Use AAA pattern (Arrange, Act, Assert)
- Create test data using object mothers or builders
- Mock external dependencies at the boundary, but try to avoid mocking in general
- Use descriptive test method names that explain the scenario, for example `Customer_does_not_add_duplicate_billing_address`

### Integration Tests

- Use TestContainers for database integration tests
- Test complete workflows end-to-end
- Verify side effects (database changes, events published)
- Use separate test database per test case

## Performance & Best Practices

### Database Access

- Use async methods for all database operations
- Use projection (Select) to load only needed data

### Memory Management

- Dispose resources properly using `using` statements
- Avoid creating unnecessary objects in hot paths

### Observability

- Use structured logging with meaningful context
- Use OpenTelemetry for distributed tracing
