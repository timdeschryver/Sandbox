FROM mcr.microsoft.com/devcontainers/dotnet:2-9.0@sha256:807917e83addb90beab95b998f81359ca127204792be8216f38c3a9db88b4601
FROM mcr.microsoft.com/devcontainers/typescript-node:4-22-bookworm@sha256:9add39631671c93a836f678b6c11d5ba759b21204f8604619ed1674b5f874f70

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.100-rc.1@sha256:c4a834e5ad71e61d3d320f377fd61726dda2c614797b3b6426ce2486949589b2 /usr/share/dotnet /usr/share/dotnet
