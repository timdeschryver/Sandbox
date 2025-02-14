FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# https://github.com/nodejs/corepack/issues/612
RUN corepack prepare pnpm@10.0.0 --activate

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build

FROM nginx:alpine

COPY --from=base /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=base /app/dist/sandbox.angular-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
