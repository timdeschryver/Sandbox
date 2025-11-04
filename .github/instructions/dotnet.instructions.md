---
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
