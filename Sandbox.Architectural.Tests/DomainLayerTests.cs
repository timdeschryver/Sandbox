using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Fluent;
using Sandbox.Architectural.Tests.ArchTUnit;

namespace Sandbox.Architectural.Tests;

internal sealed class DomainLayerReferencesTests : ArchitecturalBaseTest
{
    [Test]
    [Retry(3)]
    public async Task Domain_does_not_reference_application_or_data()
    {
        await ArchRuleDefinition.Types()
            .That()
            .Are(DomainLayer)
            .Should()
            .OnlyDependOn(ArchRuleDefinition.Types().That().HaveFullNameMatching("(Domain|StronglyTypedIds|System|Microsoft\\.CodeCoverage)"))
            .Because("Domain layer must only depend on itself")
            .Check(Architecture);
    }

    [Test]
    [Retry(3)]
    public async Task Domain_classes_have_empty_ctor()
    {
        await ArchRuleDefinition.Classes()
          .That()
          .Are(DomainLayer)
          .Should()
          .FollowCustomCondition(clazz =>
          {
              return clazz.GetConstructors().Any(c => !c.Parameters.Any());
          }, "must have a default constructor", "A default constructors needs to be available for EF.")
        .Check(Architecture);
    }
}
