using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent;
using ArchUnitNET.Fluent.Syntax.Elements.Types.Classes;
using Sandbox.Architectural.Tests.ArchTUnit;

namespace Sandbox.Architectural.Tests;

internal sealed partial class ApplicationTests : ArchitecturalBaseTest
{
    private static readonly GivenClassesConjunction NonHandlers = ArchRuleDefinition.Classes()
              .That()
              .Are(ApplicationLayer)
              .And()
              .DoNotHaveNameEndingWith("Handler");

    private static readonly GivenClassesConjunction Endpoints = NonHandlers
            .And()
            .DoNotHaveFullNameContaining("+");

    [Test]
    [Retry(3)]
    public async Task Command_and_queries_are_immutable_and_record_types()
    {
        await NonHandlers
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
    [Retry(5)]
    public async Task Endpoints_implement_a_query_or_command()
    {
        await Endpoints
            .Should()
            .FollowCustomCondition(clazz => clazz.GetMethodMembers().Any(m => m.NameContains("Query") || m.NameContains("Handle")), "have a Query or Handle method", "The endpoint needs to implement a Query or Handle method to process requests.")
            .Check(Architecture);
    }

    [Test]
    [Retry(3)]
    public async Task QueryEndpoints_have_Parameters()
    {
        await Endpoints
               .Should()
               .FollowCustomCondition(clazz =>
               {
                   var query = clazz.GetMethodMembers().SingleOrDefault(m => m.NameContains("Query"));
                   if (query != null)
                   {
                       return query.Parameters.Any(p => p.NameEquals("parameters"));
                   }
                   return true;
               }, "have parameters input", "The Query endpoint needs to have parameters as an input.")
               .Check(Architecture);
    }

    [Test]
    [Retry(3)]
    public async Task CommandEndpoints_have_Command()
    {
        await Endpoints
            .Should()
            .FollowCustomCondition(clazz =>
            {
                var command = clazz.GetMethodMembers().SingleOrDefault(m => m.NameContains("Handle"));
                if (command != null)
                {
                    return command.Parameters.Any(p => p.NameEquals("command"));
                }
                return true;
            }, "have a Command input", "The Command endpoint needs to have a Command input.")
            .Check(Architecture);
    }
}
