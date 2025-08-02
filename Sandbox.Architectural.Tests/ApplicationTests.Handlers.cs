using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent;
using Sandbox.Architectural.Tests.ArchTUnit;

namespace Sandbox.Architectural.Tests;

internal sealed partial class ApplicationTests : ArchitecturalBaseTest
{
    [Test]
    [Retry(3)]
    public async Task Handlers_reside_in_application_namespace_with_a_Handle_method()
    {
        await ArchRuleDefinition.Classes()
            .That()
            .HaveNameEndingWith("Handler")
            .And()
            .AreNot(TestLayers)
            .Should()
            .Be(ApplicationLayer)
            .Because("All handlers must reside in the Application namespace")
            .AndShould()
            .FollowCustomCondition(clazz => clazz.Members.Any(m => m.NameStartsWith("Handle")), "handler must have a Handle method", "The handler needs to implement a Handle method to process messages.")
            .Check(Architecture);
    }
}
