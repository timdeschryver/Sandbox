namespace Sandbox.Gateway.UserModule;

internal sealed class User
{
    public bool IsAuthenticated { get; init; }
    public string? Name { get; init; }
    public IEnumerable<UserClaim> Claims { get; init; } = [];
}

internal sealed class UserClaim
{
    public required string Type { get; init; }
    public required string Value { get; init; }
}
