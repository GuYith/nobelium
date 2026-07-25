FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
ARG NOTION_PAGE_ID
ARG NOTION_BOOK_PAGE_ID
ENV NOTION_PAGE_ID=$NOTION_PAGE_ID
ENV NOTION_BOOK_PAGE_ID=$NOTION_BOOK_PAGE_ID
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN corepack enable && pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN corepack enable
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "start"]
