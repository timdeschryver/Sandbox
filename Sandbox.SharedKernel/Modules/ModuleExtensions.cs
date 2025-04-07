using Microsoft.AspNetCore.Builder;
using System.Reflection;

namespace Sandbox.SharedKernel.Modules;

public static class ModuleExtensions
{
    private static readonly IModule[] Modules = DiscoverModules();

    public static WebApplicationBuilder AddModules(this WebApplicationBuilder services)
    {
        foreach (var module in Modules)
        {
            module.AddModule(services);
        }

        return services;
    }

    public static WebApplication UseModules(this WebApplication app)
    {
        //var route = app.MapGroup("/api");

        foreach (var module in Modules)
        {
            module.UseModule(app);
        }

        return app;
    }

    private static IModule[] DiscoverModules()
    {
        return Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.dll")
            .Where(filePath => Path.GetFileName(filePath).StartsWith("Sandbox.", StringComparison.Ordinal))
            .Select(Assembly.LoadFrom)
            .SelectMany(assembly => assembly.GetTypes()
                .Where(type => typeof(IModule).IsAssignableFrom(type) &&
                               type is { IsInterface: false, IsAbstract: false }))
            .Select(type => (IModule)Activator.CreateInstance(type)!)
            .ToList()
            .AsReadOnly()
            .ToArray();
    }
}