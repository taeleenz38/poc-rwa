#base-image
FROM node:22.6-alpine AS builder
ARG APPENV=dev
ADD . /app/

WORKDIR /app
RUN ls -al /app 

RUN npm ci
RUN npm run build:${APPENV}


FROM node:22.6-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APPENV=dev
COPY --from=builder /app/public ./public


RUN mkdir .next

COPY ./.env.${APPENV} .env.production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
CMD ["node", "server.js"]

 