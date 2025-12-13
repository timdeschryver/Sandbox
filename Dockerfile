FROM node:24-slim@sha256:04d9cbb7297edb843581b9bb9bbed6d7efb459447d5b6ade8d8ef988e6737804 AS base
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

FROM nginx:alpine@sha256:289decab414250121a93c3f1b8316b9c69906de3a4993757c424cb964169ad42 AS sandbox-app
COPY --from=build /prod/sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
