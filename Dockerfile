FROM node:24-slim@sha256:d8e448a56fc63242f70026718378bd4b00f8c82e78d20eefb199224a4d8e33d8 AS base
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

FROM nginx:alpine@sha256:f46cb72c7df02710e693e863a983ac42f6a9579058a59a35f1ae36c9958e4ce0 AS sandbox-app
COPY --from=build /prod/sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
