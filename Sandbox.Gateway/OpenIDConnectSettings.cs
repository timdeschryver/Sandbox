using System.ComponentModel.DataAnnotations;

namespace Sandbox.Gateway;

#pragma warning disable CA1812
internal sealed class OpenIDConnectSettings
#pragma warning restore CA1812
{
    public const string Position = "OpenIDConnectSettings";

    [Required]
    public required string Domain { get; init; }

    [Required]
    public required string ClientId { get; init; }

    [Required]
    public required string ClientSecret { get; init; }

    [Required]
    public required string Audience { get; init; }
}
