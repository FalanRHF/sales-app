# syntax=docker/dockerfile:1

FROM node:16.15.1-alpine

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]