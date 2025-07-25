using System.Diagnostics.CodeAnalysis;
using ArchUnitNET.Domain;
using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent.Conditions;

namespace Sandbox.Architectural.Tests.Conditions;

public class LastParameterOfTypeCondition<TParam> : ICondition<MethodMember>
{
    public string Description => $"Method should have a last parameter of type {typeof(TParam).FullName}.";

    public IEnumerable<ConditionResult> Check([NotNull] IEnumerable<MethodMember> objects, Architecture architecture)
    {
        foreach (var methodMember in objects)
        {
            if (methodMember.Parameters.Any() && methodMember.Parameters.Last().IsAssignableTo(typeof(TParam).FullName))
            {
                yield return new ConditionResult(methodMember, true);
            }
            else
            {
                yield return new ConditionResult(methodMember, pass: false, failDescription: $"{methodMember.FullName} does not have a last parameter of type {typeof(TParam).FullName}.");
            }
        }
    }

    public bool CheckEmpty() => true;
}
