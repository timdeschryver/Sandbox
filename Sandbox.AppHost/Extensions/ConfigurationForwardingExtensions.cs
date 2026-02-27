using Microsoft.Extensions.Configuration;

namespace Sandbox.AppHost.Extensions;

internal static class ConfigurationForwardingExtensions
{
    /// <summary>
    /// Forwards a configuration section from the AppHost to a child resource as environment variables.
    /// Array items are flattened using the .NET configuration key format (e.g. <c>FeatureFlags__0__Key</c>).
    /// </summary>
    public static IResourceBuilder<T> WithConfigurationSection<T>(
        this IResourceBuilder<T> builder,
        IConfiguration configuration,
        string sectionName) where T : IResourceWithEnvironment
    {
        var section = configuration.GetSection(sectionName);
        foreach (var kvp in section.AsEnumerable(makePathsRelative: true))
        {
            if (kvp.Value is not null)
            {
                var envKey = $"{sectionName}__{kvp.Key.Replace(":", "__", StringComparison.Ordinal)}";
                builder = builder.WithEnvironment(envKey, kvp.Value);
            }
        }

        return builder;
    }
}
