using ArchUnitNET.Domain;
using ArchUnitNET.Domain.Extensions;
using ArchUnitNET.Loader;
using Sandbox.Architectural.Tests.ArchTUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Sandbox.Architectural.Tests;

internal sealed class DomainLayerReferencesTests
{
    private static readonly Architecture Architecture = new ArchLoader().LoadAssemblies(
        System.Reflection.Assembly.Load("Sandbox.Modules.CustomerManagement")
    ).Build();

    private readonly IObjectProvider<IType> Domain = Types()
        .That()
        .HaveFullNameContaining(".Domain")
        .As("Domain");

    [Test]
    public async Task Domain_does_not_reference_application_or_data()
    {
        await Types()
            .That()
            .Are(Domain)
            .Should()
            .OnlyDependOn(Types().That().HaveFullNameMatching("(Domain|StronglyTypedIds|System|Microsoft\\.CodeCoverage)"))
            .Because("Domain layer must only depend on itself")
            .Check(Architecture);
    }

    [Test]
    public async Task Domain_classes_have_empty_ctor()
    {
        await Classes()
          .That()
          .Are(Domain)
          .Should()
          .FollowCustomCondition(clazz =>
          {
              var constructors = clazz.GetConstructors().ToList();
              if (constructors.Count == 0)
              {
                  return true;
              }
              return constructors.Any(c => !c.Parameters.Any());
          }, "must have a default constructor", "A default constructors needs to be available for EF.")
        .Check(Architecture);
    }
}