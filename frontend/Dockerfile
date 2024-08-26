#base-image
FROM node:22.6-alpine 

ADD . /app/

WORKDIR /app
RUN ls -al /app 

RUN mkdir /app/config
RUN ln -s ./config/.env .env
RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production

ENV PORT 3000
EXPOSE 3000
CMD ["npm", "start"]

 