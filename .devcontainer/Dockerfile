FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:8f4d2e325d0c07af71374436657b2627eb13f35e974596ec425d71ad49cb0196
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:5f21aff86db5eca30decdd418172f7a665eb55d288465d38021baf9c1260b6d6

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.103@sha256:9a2a64f2b27b3fd2de080f7c0e1f320559156a6d7308203f180b7b07a15d2dab /usr/share/dotnet /usr/share/dotnet
