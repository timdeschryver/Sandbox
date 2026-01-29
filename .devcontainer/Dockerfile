FROM mcr.microsoft.com/devcontainers/dotnet:2-10.0@sha256:83b3ef06623ee1ca350b12359f6be24cda4d206727d21412646f3cbdd5de21c1
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-bookworm@sha256:8f198c9de37a12b7e9f75781a6cfbd2667fa652b698604594783f30c5ccf64cd

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.102@sha256:9ce7683d4f21b1891fe6817487dd7913dbe25e7c17c5875302c2c8aef079125c /usr/share/dotnet /usr/share/dotnet
