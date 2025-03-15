namespace Sandbox.ApiService.CustomerModule;

public readonly record struct Name(string FirstName, string LastName)
{
    public static Name From(string firstName, string lastName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);

        return new Name(firstName, lastName);
    }
}
