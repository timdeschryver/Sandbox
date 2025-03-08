using System.ComponentModel.DataAnnotations;

namespace Sandbox.ApiGateway;

internal class OpenIDConnectSettings
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
