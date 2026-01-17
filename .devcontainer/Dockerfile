FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:97961d9ef283e2404a79fb9bdca5837b6af57f5f8688556e21cbc5686af72770
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:634d3ffc8c37508259a23462b838fd85a9e5bb80dcdd0b31d673aa33dc4c8592

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.102@sha256:9ce7683d4f21b1891fe6817487dd7913dbe25e7c17c5875302c2c8aef079125c /usr/share/dotnet /usr/share/dotnet
