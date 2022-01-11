FROM node:16-alpine

WORKDIR  /usr/src/app/server
COPY package*.json .
RUN npm ci
COPY . .


CMD [ "npm", "start" ]