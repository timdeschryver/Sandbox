using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.CodeDom.Compiler;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Sandbox.SharedKernel.Infrastructure;

internal static class Extensions
{
    public static void ApplyStronglyTypedIdEfConvertersFromAssembly(this ModelConfigurationBuilder configurationBuilder, Assembly assembly)
    {
        ArgumentNullException.ThrowIfNull(assembly);
        ArgumentNullException.ThrowIfNull(configurationBuilder); var types = assembly.GetTypes();

        foreach (var type in types)
        {
            if (IsVogenValueObject(type) && TryGetEfValueConverter(type, out var efCoreConverterType))
            {
                configurationBuilder
                    .Properties(type)
                    .HaveConversion(efCoreConverterType);
            }
        }
    }

    private static bool TryGetEfValueConverter(Type type, [NotNullWhen(true)] out Type? efCoreConverterType)
    {
        var inner = type.GetNestedTypes();

        foreach (var innerType in inner)
        {
            if (!typeof(ValueConverter).IsAssignableFrom(innerType) || !"EfCoreValueConverter".Equals(innerType.Name, StringComparison.Ordinal))
            {
                continue;
            }

            efCoreConverterType = innerType;
            return true;
        }

        efCoreConverterType = null;
        return false;
    }

    private static bool IsVogenValueObject(MemberInfo targetType)
    {
        var generatedCodeAttribute = targetType.GetCustomAttribute<GeneratedCodeAttribute>();
        return "Vogen".Equals(generatedCodeAttribute?.Tool, StringComparison.Ordinal);
    }
}
