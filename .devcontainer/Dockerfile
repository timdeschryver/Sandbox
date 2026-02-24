FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:8f4d2e325d0c07af71374436657b2627eb13f35e974596ec425d71ad49cb0196
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:5f21aff86db5eca30decdd418172f7a665eb55d288465d38021baf9c1260b6d6

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.103@sha256:79d2f8a9402f4f51f6ce0e919d29e0e23940a5faf894fb528a5c4f43254226e5 /usr/share/dotnet /usr/share/dotnet
