FROM node:12.16.2-alpine

WORKDIR /opt/als-oracle-pathfinder

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake bash mysql-client \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY ./src /opt/als-oracle-pathfinder/src
COPY ./package.json ./package-lock.json ./init-account-lookup.sql ./init-central-ledger.sql /opt/als-oracle-pathfinder/

RUN npm install --production

CMD ["node", "/opt/als-oracle-pathfinder/src/index.js"]
