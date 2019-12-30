FROM node:8.12.0-alpine

WORKDIR /opt/als-oracle-pathfinder

RUN apk update && apk add bash mysql-client

COPY ./src /opt/als-oracle-pathfinder/src
COPY ./package.json ./package-lock.json ./init.sql /opt/als-oracle-pathfinder/

RUN npm install --production

CMD ["node", "/opt/als-oracle-pathfinder/src/index.js"]
