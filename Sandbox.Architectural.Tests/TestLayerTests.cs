using Sandbox.Architectural.Tests.ArchTUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Sandbox.Architectural.Tests;

internal sealed class TestNamesDontIncludeShouldTests : ArchitecturalBaseTest
{
    [Test]
    [Retry(3)]
    public async Task Test_cases_dont_include_should_in_their_name()
    {
        var testMethods = Members().That().AreDeclaredIn(TestLayers).And().HaveAnyAttributes([typeof(TestAttribute)]);
        await testMethods
            .Should().NotHaveNameMatching("(?i)should")
            .Check(Architecture);
    }
}
