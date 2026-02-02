FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:537a38efbafe5153db2db1c6cc8a1cad5286e91d0e5da9bb7b310d3897d1c6cb
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:5f21aff86db5eca30decdd418172f7a665eb55d288465d38021baf9c1260b6d6

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.102@sha256:9ce7683d4f21b1891fe6817487dd7913dbe25e7c17c5875302c2c8aef079125c /usr/share/dotnet /usr/share/dotnet
