FROM node:8-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY ./*.js ./
COPY ./views ./views/
COPY ./public ./public/
ENTRYPOINT [ "node", "app.js" ]
