FROM node:22-alpine as base

WORKDIR /dash

COPY . .

RUN npm i -gE bun@1.3.3

WORKDIR /dash/client

EXPOSE 5175