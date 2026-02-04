using System.Runtime.CompilerServices;

namespace Sandbox.Modules.CustomerManagement.IntegrationTests;

public static class ModuleInitializer
{
    [ModuleInitializer]
    public static void Initialize()
    {
        VerifierSettings.ScrubMember("Id");
    }
}
