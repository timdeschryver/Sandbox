using Vogen;

// TODO: re-enable after https://github.com/SteveDunn/Vogen/issues/844, also refactor the reflection in integration tests
// [assembly: VogenDefaults(openApiSchemaCustomizations: OpenApiSchemaCustomizations.GenerateOpenApiMappingExtensionMethod)]
namespace Sandbox.SharedKernel.StronglyTypedIds;

[ValueObject<Guid>(conversions: Conversions.SystemTextJson | Conversions.EfCoreValueConverter)]
public readonly partial struct CustomerId
{
    public static CustomerId New() => From(Guid.NewGuid());
    private static Guid NormalizeInput(Guid input)
    {
        return input;
    }

    private static Validation Validate(Guid _)
    {
        var isValid = true;
        return isValid ? Validation.Ok : Validation.Invalid("[todo: describe the validation]");
    }
};

[ValueObject<Guid>(conversions: Conversions.SystemTextJson | Conversions.EfCoreValueConverter)]
public readonly partial struct CustomerAddressId
{
    public static CustomerAddressId New() => From(Guid.NewGuid());
    private static Guid NormalizeInput(Guid input)
    {
        return input;
    }

    private static Validation Validate(Guid _)
    {
        var isValid = true;
        return isValid ? Validation.Ok : Validation.Invalid("[todo: describe the validation]");
    }
}
