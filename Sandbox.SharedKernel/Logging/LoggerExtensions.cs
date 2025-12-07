using Microsoft.Extensions.Logging;
using Sandbox.SharedKernel.StronglyTypedIds;

namespace Sandbox.SharedKernel.Logging;

public static partial class LoggerExtensions
{
    [LoggerMessage(
        EventId = 1000,
        Level = LogLevel.Debug,
        Message = "Forwarding telemetry for {ResourceName} to the collector")]
    public static partial void LogForwardingTelemetry(
        this ILogger logger,
        string resourceName);

    [LoggerMessage(
        EventId = 2000,
        Level = LogLevel.Information,
        Message = "Customer {CustomerId} created: {FirstName} {LastName}")]
    public static partial void LogCustomerCreated(
        this ILogger logger,
        CustomerId customerId,
        string firstName,
        string lastName);

    [LoggerMessage(
        EventId = 2001,
        Level = LogLevel.Information,
        Message = "Billing received customer {CustomerId}: {FirstName} {LastName}")]
    public static partial void LogBillingCustomerReceived(
        this ILogger logger,
        CustomerId customerId,
        string firstName,
        string lastName);

    [LoggerMessage(
        EventId = 2002,
        Level = LogLevel.Information,
        Message = "Database initialization completed after {ElapsedMilliseconds}ms")]
    public static partial void LogDatabaseInitializationCompleted(
        this ILogger logger,
        long elapsedMilliseconds);

    [LoggerMessage(
        EventId = 2003,
        Level = LogLevel.Information,
        Message = "Seeding database")]
    public static partial void LogSeedingDatabase(this ILogger logger);

    [LoggerMessage(
        EventId = 2004,
        Level = LogLevel.Information,
        Message = "XSRF token added to response for request path: {RequestPath}")]
    public static partial void LogXsrfTokenAdded(
        this ILogger logger,
        string? requestPath);

    [LoggerMessage(
        EventId = 2005,
        Level = LogLevel.Information,
        Message = "Validating antiforgery token for request path: {RequestPath}")]
    public static partial void LogValidatingAntiforgeryToken(
        this ILogger logger,
        string? requestPath);

    [LoggerMessage(
        EventId = 2006,
        Level = LogLevel.Information,
        Message = "Adding bearer token to request headers for request path: {RequestPath}")]
    public static partial void LogAddingBearerToken(
        this ILogger logger,
        string? requestPath);

    [LoggerMessage(
        EventId = 2007,
        Level = LogLevel.Information,
        Message = "{Line}")]
    public static partial void LogCommandOutput(
        this ILogger logger,
        string line);

    [LoggerMessage(
        EventId = 3000,
        Level = LogLevel.Warning,
        Message = "No {ResourceType} resource found")]
    public static partial void LogResourceNotFound(
        this ILogger logger,
        string resourceType);

    [LoggerMessage(
        EventId = 3001,
        Level = LogLevel.Warning,
        Message = "No {EndpointName} endpoint for the collector")]
    public static partial void LogEndpointNotFound(
        this ILogger logger,
        string endpointName);

    [LoggerMessage(
        EventId = 4000,
        Level = LogLevel.Error,
        Message = "Antiforgery token validation failed for request path: {RequestPath}")]
    public static partial void LogAntiforgeryValidationFailed(
        this ILogger logger,
        Exception ex,
        string? requestPath);

    [LoggerMessage(
        EventId = 4001,
        Level = LogLevel.Error,
        Message = "Could not get access token: {GetUserAccessTokenError} for request path: {RequestPath}. {Error}")]
    public static partial void LogAccessTokenFailed(
        this ILogger logger,
        string? getUserAccessTokenError,
        string? requestPath,
        string? error);
}
