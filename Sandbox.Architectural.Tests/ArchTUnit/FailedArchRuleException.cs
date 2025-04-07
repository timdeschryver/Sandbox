using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Fluent.Extensions;
using TUnit.Core.Exceptions;

namespace Sandbox.Architectural.Tests.ArchTUnit;

#pragma warning disable CA1032 // Implement standard exception constructors
internal sealed class FailedArchRuleException : TUnitException
#pragma warning restore CA1032 // Implement standard exception constructors
{
    /// <summary>
    /// Creates a new instance of the <see href="FailedArchRuleException" /> class.
    /// </summary>
    /// <param name="architecture">The architecture which was tested</param>
    /// <param name="archRule">The archrule that failed</param>
    public FailedArchRuleException(Architecture architecture, IArchRule archRule)
        : this(archRule.Evaluate(architecture)) { }

    /// <summary>
    /// Creates a new instance of the <see href="FailedArchRuleException" /> class.
    /// </summary>
    /// <param name="evaluationResults">The results of the evaluation of the archrule</param>
    public FailedArchRuleException(IEnumerable<EvaluationResult> evaluationResults)
        : base(evaluationResults.ToErrorMessage()) { }
}