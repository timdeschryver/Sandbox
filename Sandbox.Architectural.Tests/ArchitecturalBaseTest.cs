
using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Loader;

namespace Sandbox.Architectural.Tests;

public abstract class ArchitecturalBaseTest
{
    protected static readonly System.Reflection.Assembly CustomerManagementAssembly = typeof(Modules.CustomerManagement.CustomerManagementModule).Assembly;
    protected static readonly System.Reflection.Assembly CustomerManagementTestsAssembly = typeof(Modules.CustomerManagement.Tests.CustomerTests).Assembly;
    protected static readonly System.Reflection.Assembly CustomerManagementIntegrationTestsAssembly = typeof(Modules.CustomerManagement.IntegrationTests.CustomerApiTests).Assembly;
    protected static readonly System.Reflection.Assembly BillingAssembly = typeof(Modules.Billing.BillingModule).Assembly;
    protected static readonly System.Reflection.Assembly BillingTestsAssembly = typeof(Modules.Billing.Tests.PlaceholderTest).Assembly;
    protected static readonly System.Reflection.Assembly SharedKernelAssembly = typeof(SharedKernel.Modules.IModule).Assembly;

    protected static readonly IObjectProvider<IType> DomainLayer =
        ArchRuleDefinition.Types().That().HaveFullNameContaining(".Domain").As("Domain Layer");
    protected static readonly IObjectProvider<IType> ApplicationLayer =
        ArchRuleDefinition.Types().That().HaveFullNameContaining(".Application").As("Application Layer");
    protected static readonly IObjectProvider<IType> HandlersLayer =
        ArchRuleDefinition.Types().That().HaveFullNameContaining(".Handlers").As("Handlers Layer");
    protected static readonly IObjectProvider<IType> InfrastructureLayer =
        ArchRuleDefinition.Types().That().HaveFullNameContaining(".Data").As("Infrastructure Layer");
    protected static readonly IObjectProvider<IType> SharedKernelLayer =
        ArchRuleDefinition.Types().That().ResideInAssembly("Sandbox.SharedKernel").As("Shared Kernel Layer");
    protected static readonly IObjectProvider<IType> TestLayers =
        ArchRuleDefinition.Types().That().HaveFullNameContaining(".Tests").Or().HaveFullNameContaining(".IntegrationTests").As("Test Layers");

    protected static readonly Architecture Architecture = new ArchLoader()
        .LoadAssemblies(
            CustomerManagementAssembly,
            CustomerManagementTestsAssembly,
            BillingAssembly,
            BillingTestsAssembly,
            SharedKernelAssembly,
            CustomerManagementIntegrationTestsAssembly)
        .Build();
}