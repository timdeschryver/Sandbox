using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;

namespace Sandbox.Architectural.Tests;

public static class ArchRuleAssert
{
    /// <summary>
    /// Verifies that the architecture meets the criteria of the archrule.
    /// </summary>
    /// <param name="architecture">The architecture to be tested</param>
    /// <param name="archRule">The rule to test the architecture with</param>
    /// <exception cref="FailedArchRuleException">Thrown if the rule is violated</exception>
    public static async Task CheckRule(Architecture architecture, IArchRule archRule)
    {
        if (!archRule.HasNoViolations(architecture))
        {
            throw new FailedArchRuleException(architecture, archRule);
        }
        await Task.CompletedTask;
    }
}
