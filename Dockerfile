FROM node:22-slim@sha256:4a4884e8a44826194dff92ba316264f392056cbe243dcc9fd3551e71cea02b90 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY Sandbox.AngularWorkspace /usr/src/app/Sandbox.AngularWorkspace
COPY .npmrc /usr/src/app
COPY package.json /usr/src/app
COPY pnpm-lock.yaml /usr/src/app
COPY pnpm-workspace.yaml /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=./Sandbox.AngularWorkspace --prod /prod/sandbox-app
RUN ls /prod/sandbox-app

FROM nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8 AS sandbox-app
COPY --from=build /prod/sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
