using ArchUnitNET.Fluent;
using Sandbox.Architectural.Tests.ArchTUnit;
using Sandbox.Architectural.Tests.Conditions;

namespace Sandbox.Architectural.Tests;

internal sealed class TaskMethodTests : ArchitecturalBaseTest
{
    [Test]
    [Retry(3)]
    public async Task Methods_returning_Task_have_CancellationToken_as_last_parameter()
    {
        await ArchRuleDefinition.MethodMembers()
            .That()
            .HaveReturnType(typeof(Task), typeof(Task<>), typeof(ValueTask), typeof(ValueTask<>))
            .And()
            .DoNotHaveFullNameContaining("Test")
            .Should()
            .FollowCustomCondition(new LastParameterOfTypeCondition<CancellationToken>())
            .Check(Architecture);
    }
}
