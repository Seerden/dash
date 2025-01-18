FROM node:20-alpine

RUN corepack enable

WORKDIR /dash
COPY . .

RUN yarn install
COPY . .

WORKDIR /dash/client

COPY ./client/package*.json .

EXPOSE 5175