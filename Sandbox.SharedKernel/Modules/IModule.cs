using Microsoft.AspNetCore.Builder;

namespace Sandbox.SharedKernel.Modules;

public interface IModule
{
    WebApplicationBuilder AddModule(WebApplicationBuilder builder);
    WebApplication UseModule(WebApplication app);
}
