FROM node:22-alpine as base

WORKDIR /dash
COPY . .

RUN npm i -gE bun@1.3.3

WORKDIR /dash/server

RUN apk add --no-cache aws-cli

EXPOSE 5000

ENV CHOKIDAR_USEPOLLING=true