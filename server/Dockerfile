FROM node:20-alpine

WORKDIR /dash

COPY . .

WORKDIR /dash/server

COPY package*.json ./

# RUN yarn build # don't need to build in development

EXPOSE 5000

ENV CHOKIDAR_USEPOLLING=true