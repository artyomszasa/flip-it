FROM node:8-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY ./*.js ./
ENTRYPOINT [ "node", "app.js" ]
