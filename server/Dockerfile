FROM node:20-alpine

WORKDIR /dash

COPY . .

RUN yarn install

WORKDIR /dash/server

COPY package*.json ./

RUN yarn install
COPY . .

# RUN yarn build # don't need to build in development

EXPOSE 5000

CMD ["yarn", "dev"]