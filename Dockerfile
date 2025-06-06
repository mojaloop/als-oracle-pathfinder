# Arguments
ARG NODE_VERSION=lts-alpine

# NOTE: Ensure you set NODE_VERSION Build Argument as follows...
#
#  export NODE_VERSION="$(cat .nvmrc)-alpine" \
#  docker build \
#    --build-arg NODE_VERSION=$NODE_VERSION \
#    -t mojaloop/als-oracle-pathfinder:local \
#    . \
#

# Build Image
FROM node:${NODE_VERSION} as builder
WORKDIR /opt/app

RUN apk --no-cache add git
RUN apk add --no-cache -t build-dependencies make gcc g++ python3 libtool openssl-dev autoconf automake bash \
    && cd $(npm root -g)/npm

COPY ./package.json ./package-lock.json ./init-account-lookup.sql ./init-central-ledger.sql /opt/app/
COPY ./src /opt/app/src

RUN npm ci

FROM node:${NODE_VERSION}
# RUN apk add --no-cache mysql-client
WORKDIR /opt/app


# Create empty log file & link stdout to the application log file
RUN mkdir ./logs && touch ./logs/combined.log
RUN ln -sf /dev/stdout ./logs/combined.log

# Create a non-root user: ml-user
RUN adduser -D ml-user
USER ml-user

COPY --chown=ml-user --from=builder /opt/app/ .
RUN npm prune --production

CMD ["node", "/opt/als-oracle-pathfinder/src/index.js"]
