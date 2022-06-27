# syntax=docker/dockerfile:1

FROM node:16.15.1

WORKDIR /server

COPY package*.json ./

RUN npm install

RUN npm i -g nodemon

COPY . .

EXPOSE 5000

CMD [ "nodemon", "-L", "index.js" ]