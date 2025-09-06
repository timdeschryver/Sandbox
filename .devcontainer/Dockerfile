FROM mcr.microsoft.com/devcontainers/dotnet:1-9.0@sha256:9182c82253292f4572383b0b8ba56229a097dd250299abba5028c0c1d0da773d
FROM mcr.microsoft.com/devcontainers/typescript-node:3-22-bookworm@sha256:df90a1e397d6096285b6e0ae804c20f7c26a2234eb50245502993cf9bd1fa9e3

COPY --from=mcr.microsoft.com/dotnet/nightly/sdk:10.0.100-preview.7@sha256:94802f6fcff48a83deaa23b474db38d969529eef8349d5db844ecb42ea7f7851 /usr/share/dotnet /usr/share/dotnet
