namespace Sandbox.SharedKernel.FeatureFlags;

/// <summary>
/// A feature flag exposed to the frontend.
/// </summary>
public sealed record FeatureFlag(string Key, bool Enabled);
