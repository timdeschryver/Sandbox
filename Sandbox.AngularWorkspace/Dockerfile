FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /sandbox-app

COPY package.json .
COPY pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build sandbox-app

FROM nginx:alpine

COPY --from=base /sandbox-app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=base /sandbox-app/dist/sandbox-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
