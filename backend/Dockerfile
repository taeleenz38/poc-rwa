FROM node:22.6.0-alpine as builder


# RUN apt-get update && apt-get install -y sqlite3
# RUN apt-get install -y libreoffice-common
# RUN apt-get install -y libreoffice-writer
# ARG APP
ADD . /app/

WORKDIR /app
RUN ls -al /app 
RUN node -v

RUN npm ci
RUN npm run build 

FROM node:22.6.0-alpine as runner

WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
RUN apk add --no-cache libreoffice-common
RUN apk add --no-cache libreoffice-writer

COPY --from=builder /app/dist /app/dist
COPY package.json /app
COPY package-lock.json /app
RUN ls -al /app 
RUN npm ci --production
RUN ls -al /app 

COPY ./config /app/dist/config 
RUN mkdir /app/dist/db
RUN touch /app/dist/db/database.db

# COPY ./apps/${APP}/src/resources /app/dist/apps/${APP}/src/
EXPOSE 3000
ENV APP_PATH=/app/dist/main.js
CMD node ${APP_PATH}

