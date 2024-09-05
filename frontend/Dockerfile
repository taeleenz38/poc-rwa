#base-image
FROM node:20.11.1-alpine AS builder
ADD . /app/

WORKDIR /app
RUN ls -al /app 

RUN npm ci
RUN npm run build
RUN ls -al /app 

FROM node:20.11.1-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
ENV NODE_ENV=production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
CMD ["node", "server.js"]

 