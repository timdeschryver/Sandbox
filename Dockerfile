FROM node:24-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS base
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

FROM nginx:alpine@sha256:df221db836e1754089190208cee7eeda94f233197056426eda74a43ab1abeac2 AS sandbox-app
COPY --from=build /prod/sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
