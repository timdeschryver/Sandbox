using System.Diagnostics.CodeAnalysis;

namespace Sandbox.ApiService.CustomerModule;

public readonly record struct Name(string FirstName, string LastName)
{
    public static Name From([NotNull] string? firstName, [NotNull] string? lastName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);

        return new Name(firstName, lastName);
    }
}
