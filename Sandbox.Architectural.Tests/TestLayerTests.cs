using ArchUnitNET.Domain;
using ArchUnitNET.Loader;
using Sandbox.Architectural.Tests.ArchTUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Sandbox.Architectural.Tests;

internal sealed class TestNamesDontIncludeShouldTests
{
    private static readonly Architecture Architecture = new ArchLoader().LoadAssemblies(
        System.Reflection.Assembly.Load("Sandbox.Modules.CustomerManagement.Tests")
    ).Build();

    [Test]
    public async Task Test_cases_dont_include_should_in_their_name()
    {
        var testMethods = Members().That().HaveAnyAttributes([typeof(TestAttribute)]);
        await testMethods
            .Should().NotHaveName("(?i)should", true)
            .Check(Architecture);
    }
}
