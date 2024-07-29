FROM node:22.5.1

# RUN apk update && apk upgrade
# RUN apk add --no-cache sqlite
RUN apt-get update && apt-get install -y sqlite3

ARG APP
ADD . /app/

WORKDIR /app
RUN ls -al /app 
RUN node -v

RUN npm install
RUN npm run build 
COPY ./config /app/dist/config/
RUN mkdir /app/dist/db
RUN touch /app/dist/db/database.db

# COPY ./apps/${APP}/src/resources /app/dist/apps/${APP}/src/
EXPOSE 3000
ENV APP_PATH=/app/dist/main.js
CMD node ${APP_PATH}

