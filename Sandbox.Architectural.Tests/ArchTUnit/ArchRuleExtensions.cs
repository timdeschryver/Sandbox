using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;

namespace Sandbox.Architectural.Tests.ArchTUnit;

internal static class ArchRuleExtensions
{
    /// <summary>
    /// Verifies that the architecture meets the criteria of the archrule.
    /// </summary>
    /// <param name="archRule">The rule to test the architecture with</param>
    /// <param name="architecture">The architecture to be tested</param>
    public static async Task Check(this IArchRule archRule, Architecture architecture)
    {
        await ArchRuleAssert.CheckRule(architecture, archRule);
    }

    /// <summary>
    /// Verifies that the architecture meets the criteria of the archrule.
    /// </summary>
    /// <param name="architecture">The architecture to be tested</param>
    /// <param name="archRule">The rule to test the architecture with</param>
    public static async Task CheckRule(this Architecture architecture, IArchRule archRule)
    {
        await ArchRuleAssert.CheckRule(architecture, archRule);
    }
}
