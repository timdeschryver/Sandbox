FROM mcr.microsoft.com/devcontainers/dotnet:1-9.0@sha256:b878b60a68aadab1a1d7e7ace12504073ce5a6ce568c785f54a9ef4b834e373f
FROM mcr.microsoft.com/devcontainers/typescript-node:2-22-bookworm@sha256:2baa40a4eef3ac5b42d53acddaca3aac2e47bc30c54788f6fe299dbc5da83262

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.100-preview.7 /usr/share/dotnet /usr/share/dotnet
