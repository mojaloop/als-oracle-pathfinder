FROM node:8.11.3-alpine

WORKDIR /app/src

CMD ["node", "./server.js"]

COPY ./package.json ./package-lock.json /app/
COPY ./src/lib/pathfinder/package.json ./src/lib/pathfinder/package-lock.json /app/src/lib/pathfinder/
RUN npm install --production

COPY ./src /app/src/
COPY ./config /app/config/
