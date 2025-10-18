FROM mcr.microsoft.com/devcontainers/dotnet:1-9.0@sha256:7572080d1ce09283b8bc2504e3e88cab79dede5eb7e66973d544eea86c3fa216
FROM mcr.microsoft.com/devcontainers/typescript-node:4-22-bookworm@sha256:e83fd95d62246ef128dccc719461b61bbb8eaaf016ed678161a2a5f33a547c10

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.100-rc.1@sha256:c4a834e5ad71e61d3d320f377fd61726dda2c614797b3b6426ce2486949589b2 /usr/share/dotnet /usr/share/dotnet
