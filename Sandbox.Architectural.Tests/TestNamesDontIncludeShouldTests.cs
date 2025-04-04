using ArchUnitNET.Domain;
using ArchUnitNET.Loader;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Sandbox.Architectural.Tests;

public class TestNamesDontIncludeShouldTests
{
    private static readonly Architecture Architecture = new ArchLoader().LoadAssemblies(
        System.Reflection.Assembly.Load("Sandbox.Customer.Tests")
    ).Build();

    [Test]
    public async Task Testcase_names_dont_include_should_in_their_name()
    {
        var testMethods = Members().That().HaveAnyAttributes([typeof(TestAttribute)]);
        await testMethods
            .Should().NotHaveName("(?i)should", true)
            .Check(Architecture);
    }
}
