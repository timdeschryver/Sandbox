using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent;
using ArchUnitNET.Fluent.Syntax.Elements.Types.Classes;
using Sandbox.Architectural.Tests.ArchTUnit;

namespace Sandbox.Architectural.Tests;

internal sealed partial class HandlerTests : ArchitecturalBaseTest
{
    private static readonly GivenClassesConjunction s_endpoints = ArchRuleDefinition.Classes()
              .That()
              .Are(ApplicationLayer)
              .And()
              .AreNotNested()
              .And()
              .DoNotHaveNameEndingWith("Handler");

    [Test]
    [Retry(3)]
    public async Task Command_and_queries_are_immutable_and_record_types()
    {
        await ArchRuleDefinition.Classes()
            .That()
            .AreNestedIn(s_endpoints)
            .And()
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
    [Retry(3)]
    public async Task Endpoints_implement_a_query_or_command()
    {
        await s_endpoints
            .Should()
            .FollowCustomCondition(clazz => clazz.GetMethodMembers().Any(m => m.NameContains("Query") || m.NameContains("Handle")), "have a Query or Handle method", "The endpoint needs to implement a Query or Handle method to process requests.")
            .Check(Architecture);
    }

    [Test]
    [Retry(3)]
    public async Task QueryEndpoints_have_Parameters()
    {
        await s_endpoints
               .Should()
               .FollowCustomCondition(clazz =>
               {
                   var query = clazz.GetMethodMembers().SingleOrDefault(m => m.NameContains("Query"));
                   if (query != null)
                   {
                       return query.Parameters.Any(p => p.NameEquals("Parameters"));
                   }
                   return true;
               }, "have parameters input", "The Query endpoint needs to have parameters as an input.")
               .Check(Architecture);
    }

    [Test]
    [Retry(3)]
    public async Task CommandEndpoints_have_Command()
    {
        await s_endpoints
            .Should()
            .FollowCustomCondition(clazz =>
            {
                var command = clazz.GetMethodMembers().SingleOrDefault(m => m.NameContains("Handle"));
                if (command != null)
                {
                    return command.Parameters.Any(p => p.NameEquals("Command"));
                }
                return true;
            }, "have a Command input", "The Command endpoint needs to have a Command input.")
            .Check(Architecture);
    }
}
