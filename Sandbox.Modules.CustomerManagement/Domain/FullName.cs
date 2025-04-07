using System.Diagnostics.CodeAnalysis;

namespace Sandbox.Modules.CustomerManagement.Domain;

public readonly record struct FullName(string FirstName, string LastName)
{
    public static FullName From([NotNull] string? firstName, [NotNull] string? lastName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);

        return new FullName(firstName, lastName);
    }

    public override string ToString()
    {
        return $"{FirstName} {LastName}";
    }
}
