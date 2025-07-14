using Sandbox.Modules.CustomerManagement.Domain;
using TUnit.Assertions.AssertConditions.Throws;

namespace Sandbox.Modules.CustomerManagement.Tests;

public sealed class FullNameTests
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

    [Test]
    public async Task FullName_creates_valid_instance()
    {
        var fullName = FullName.From("Alice", "Smith");

        await Assert.That(fullName)
            .HasMember(s => s.FirstName).EqualTo("Alice")
            .HasMember(s => s.LastName).EqualTo("Smith");
    }
}