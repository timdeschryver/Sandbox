namespace Sandbox.SharedKernel.FeatureFlags;

/// <summary>
/// Strongly-typed configuration for a single feature flag.
/// Bound from the <c>FeatureFlags</c> configuration section.
/// </summary>
public sealed class FeatureFlagDefinition
{
    public required string Key { get; init; }
    public bool Enabled { get; init; }
    public bool FrontendVisible { get; init; }
    public required string Description { get; init; }
    public DateOnly DateIntroduced { get; init; }
}
