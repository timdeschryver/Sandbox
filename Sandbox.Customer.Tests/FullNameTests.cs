using Sandbox.ApiService.CustomerModule;
using TUnit.Assertions.AssertConditions.Throws;

namespace Sandbox.Customer.Tests;

public class FullNameTests
{
    [Test]
    [Arguments("Alice", null)]
    [Arguments("Alice", "")]
    [Arguments(null, "Smith")]
    [Arguments("", "Smith")]
    [DisplayName("Test with: $firstName $lastName")]
    public async Task FullName_throws_exception_when_name_is_null_or_empty(string? firstName, string? lastName)
    {
        await Assert.That(() =>
        {
            FullName.From(firstName, lastName);
        }).Throws<ArgumentException>();
    }
}