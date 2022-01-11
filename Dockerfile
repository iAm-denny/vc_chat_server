FROM node:16-alpine

WORKDIR /app/server
ADD server /app/server
RUN npm install


COPY . .


CMD [ "npm", "start" ]