using Sandbox.ApiService.CustomerModule;
using TUnit.Assertions.AssertConditions.Throws;

namespace Sandbox.Customer.Tests;

public class AddressTests
{
    [Test]
    [Arguments("")]
    [Arguments(null)]
    [DisplayName("Test with: $street")]
    public async Task Address_throws_exception_when_street_is_null(string? street)
    {
        await Assert.That(() =>
        {
            Address.From(street, "New York", "10001");
        }).Throws<ArgumentException>();
    }

    [Test]
    [Arguments("")]
    [Arguments(null)]
    [DisplayName("Test with: $city")]
    public async Task Address_throws_exception_when_city_is_empty(string? city)
    {
        await Assert.That(() =>
        {
            Address.From("123 Main St", city, "10001");
        }).Throws<ArgumentException>();
    }

    [Test]
    [Arguments("")]
    [Arguments(null)]
    [DisplayName("Test with: $zipCode")]
    public async Task Address_throws_exception_when_zip_code_is_null(string? zipCode)
    {
        await Assert.That(() =>
        {
            Address.From("123 Main St", "New York", zipCode);
        }).Throws<ArgumentException>();
    }
}