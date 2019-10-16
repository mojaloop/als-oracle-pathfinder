FROM node:8.12.0-alpine

WORKDIR /opt/als-oracle-pathfinder

COPY ./src /opt/als-oracle-pathfinder/src
COPY ./package.json ./package-lock.json /opt/als-oracle-pathfinder/
RUN npm install --production

CMD ["node", "/opt/als-oracle-pathfinder/src/index.js"]
