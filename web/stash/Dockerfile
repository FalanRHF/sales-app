FROM node:16.15.1-alpine AS builder

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx
COPY ./nginx.config /etc/nginx/nginx.template
COPY --from=builder /web/build /usr/share/nginx/html