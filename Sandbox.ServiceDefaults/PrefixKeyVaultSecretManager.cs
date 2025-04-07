using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;

namespace Sandbox.ServiceDefaults;

public class PrefixKeyVaultSecretManager(string prefix) : KeyVaultSecretManager
{
    private readonly string _prefix = $"{prefix}-";

    public override bool Load(SecretProperties secret)
    {
        ArgumentNullException.ThrowIfNull(secret);
        return secret.Name.StartsWith(_prefix, StringComparison.Ordinal);
    }

    public override string GetKey(KeyVaultSecret secret)
    {
        ArgumentNullException.ThrowIfNull(secret);
        return secret.Name[_prefix.Length..].Replace("--", ConfigurationPath.KeyDelimiter, StringComparison.Ordinal);
    }
}
