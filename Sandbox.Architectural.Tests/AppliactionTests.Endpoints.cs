using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent;
using ArchUnitNET.Fluent.Syntax.Elements.Types.Classes;
using Sandbox.Architectural.Tests.ArchTUnit;

namespace Sandbox.Architectural.Tests;

internal sealed partial class AppliactionTests : ArchitecturalBaseTest
{
    private static readonly GivenClassesThat NonHandlers = ArchRuleDefinition.Classes()
              .That()
              .Are(ApplicationLayer)
              .And()
              .DoNotHaveNameEndingWith("Handler")
              .And();

    private static readonly GivenClassesConjunction Endpoints = NonHandlers
            .DoNotHaveFullNameContaining("+");

    [Test]
    public async Task Command_and_queries_are_immutable_and_record_types()
    {
        await NonHandlers
            .HaveName("Command")
            .Or()
            .HaveName("Parameters")
            .Should()
            .BeImmutable()
            .AndShould()
            .BeRecord()
            .Check(Architecture);
    }

    [Test]
    public async Task Endpoints_are_either_queries_or_commands()
    {
        await Endpoints
            .Should()
            .FollowCustomCondition(clazz => clazz.Members.Any(m => m.NameEquals("Query") || m.NameEquals("Handle")), "endpoint must have a Query or Handle method", "The endpoint needs to implement a Query or Handle method to process requests.")
            .Check(Architecture);
    }

    [Test]
    public async Task QueryEndpoints_have_Parameters()
    {
        await Endpoints
            .Should()
            .FollowCustomCondition(clazz =>
            {
                if (clazz.Members.Any(m => m.NameStartsWith("Query")))
                {
                    return clazz.GetFieldMembers().Any(m => m.NameEquals("Parameters"));
                }
                return true;
            }, "Query endpoint must have parameters input", "The Query endpoint needs to have parameters as an input.")
            .Check(Architecture);
    }

    [Test]
    public async Task CommandEndpoints_have_Command()
    {
        await Endpoints
            .Should()
            .FollowCustomCondition(clazz =>
            {
                if (clazz.Members.Any(m => m.NameStartsWith("Handle")))
                {
                    return clazz.GetFieldMembers().Any(m => m.NameEquals("Command"));
                }
                return true;
            }, "Command endpoint must have a Command input", "The Command endpoint needs to have a Command input.")
            .Check(Architecture);
    }
}
