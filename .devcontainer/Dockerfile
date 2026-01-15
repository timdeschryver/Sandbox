FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:97961d9ef283e2404a79fb9bdca5837b6af57f5f8688556e21cbc5686af72770
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:634d3ffc8c37508259a23462b838fd85a9e5bb80dcdd0b31d673aa33dc4c8592

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.101@sha256:aa39fcfd999be8ff4e871605065ab8e917469543a75c562bc0988b83a61fd2cf /usr/share/dotnet /usr/share/dotnet
