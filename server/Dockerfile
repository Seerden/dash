FROM node:20-alpine

RUN corepack enable

WORKDIR /dash

COPY . .

WORKDIR /dash/server

COPY package*.json ./

EXPOSE 5000

ENV CHOKIDAR_USEPOLLING=true