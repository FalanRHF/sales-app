# syntax=docker/dockerfile:1

FROM node:16.15.1-alpine as build

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx
COPY --from=build /web/build /usr/share/nginx/html