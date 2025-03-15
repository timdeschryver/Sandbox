namespace Sandbox.ApiService.CustomerModule;

public readonly record struct Address(string Street, string City, string ZipCode)
{
    public static Address From(string Street, string City, string ZipCode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Street);
        ArgumentException.ThrowIfNullOrWhiteSpace(City);
        ArgumentException.ThrowIfNullOrWhiteSpace(ZipCode);

        return new Address(Street, City, ZipCode);
    }
}
