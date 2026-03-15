using System.Reflection;
using Microsoft.AspNetCore.Builder;

namespace Sandbox.SharedKernel.Modules;

public static class ModuleExtensions
{
    private static readonly IModule[] s_modules = DiscoverModules();

    public static WebApplicationBuilder AddModules(this WebApplicationBuilder services)
    {
        foreach (var module in s_modules)
        {
            module.AddModule(services);
        }

        return services;
    }

    public static WebApplication UseModules(this WebApplication app)
    {
        foreach (var module in s_modules)
        {
            module.UseModule(app);
        }

        return app;
    }

    private static IModule[] DiscoverModules()
    {
        return [.. Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.dll")
            .Where(filePath => Path.GetFileName(filePath).StartsWith("Sandbox.", StringComparison.Ordinal))
            .Select(Assembly.LoadFrom)
            .SelectMany(assembly => assembly.GetTypes()
                .Where(type => typeof(IModule).IsAssignableFrom(type) &&
                               type is { IsInterface: false, IsAbstract: false }))
            .Select(type => (IModule)Activator.CreateInstance(type)!)
            .ToList()
            .AsReadOnly()];
    }
}
