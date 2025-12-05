FROM mcr.microsoft.com/devcontainers/dotnet:2-9.0@sha256:bc9f53a02bd885a0d287bd3bb315c8cae6bb023f4f8db83a5797270f8039155e
FROM mcr.microsoft.com/devcontainers/typescript-node:4-22-bookworm@sha256:e3a386f77bc75f55cd8512de30b761df1d9f36317d0b1bebd897f0a76b55db3d

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.100-rc.1@sha256:c4a834e5ad71e61d3d320f377fd61726dda2c614797b3b6426ce2486949589b2 /usr/share/dotnet /usr/share/dotnet
