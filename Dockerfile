FROM node:12.16.2-alpine AS builder

WORKDIR /opt/als-oracle-pathfinder

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake bash mysql-client \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY ./package.json ./package-lock.json ./init-account-lookup.sql ./init-central-ledger.sql /opt/als-oracle-pathfinder/
COPY ./src /opt/als-oracle-pathfinder/src

RUN npm install --production

FROM node:12.16.2-alpine

RUN apk add --no-cache mysql-client

ARG BUILD_DATE
ARG VCS_URL
ARG VCS_REF
ARG VERSION

# See http://label-schema.org/rc1/ for label schema info
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.name="als-oracle-pathfinder"
LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.vcs-url=$VCS_URL
LABEL org.label-schema.vcs-ref=$VCS_REF
LABEL org.label-schema.url="https://mojaloop.io/"
LABEL org.label-schema.version=$VERSION

WORKDIR /opt/als-oracle-pathfinder

COPY --from=builder /opt/als-oracle-pathfinder .

CMD ["node", "/opt/als-oracle-pathfinder/src/index.js"]
