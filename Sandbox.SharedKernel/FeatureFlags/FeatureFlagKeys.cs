namespace Sandbox.SharedKernel.FeatureFlags;

public static class FeatureFlagKeys
{
    public const string BillingEnabled = "billing-enabled";

    public static IReadOnlyList<string> All { get; } =
    [
        BillingEnabled,
    ];
}
