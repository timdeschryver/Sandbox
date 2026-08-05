FROM node:24-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03 AS base
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
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline
RUN pnpm run -r build
RUN pnpm deploy --filter=./Sandbox.AngularWorkspace --prod /prod/sandbox-app
RUN ls /prod/sandbox-app

FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 AS sandbox-app
COPY --from=build /prod/sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
