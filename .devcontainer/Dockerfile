FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:0c412724a61b030f27d4ca38a876db27a88c09a7c32344013562710f4117aec3
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:7958dd7e6fe4242fce6ba4f57b9de561ea82233d5542921b5335d435c2c78791

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.201@sha256:c8394e955b6f8f1aa4fe8f6a7dcdefada7ed08a78baca40cd8ab23e00417f373 /usr/share/dotnet /usr/share/dotnet
