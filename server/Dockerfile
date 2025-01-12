FROM node:18.12.0-alpine

WORKDIR /dash

COPY . .

RUN npm install

WORKDIR /dash/server

COPY package*.json ./

RUN npm install
COPY . .

# RUN npm run build # don't need to build in development

EXPOSE 5000

CMD ["npm", "run", "dev"]