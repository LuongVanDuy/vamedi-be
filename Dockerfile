# Stage 1
FROM node:14.20-alpine AS builder

# couchbase sdk requirements
RUN apk update && apk add yarn curl bash python3 g++ make && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
# RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

# Create app directory
WORKDIR /app

# Copy package.json and required file for install packages
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install app dependencies
RUN yarn install --frozen-lockfile

# Required if not done in postinstall
RUN yarn generate

# Copy all and build
COPY . .
RUN yarn build

# Remove development dependencies
RUN npm prune --production

# run node prune
# RUN /usr/local/bin/node-prune

# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map

# Stage 2
FROM node:14.20-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env* ./

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
# ENV OPENSSL_CONF=/dev/null

EXPOSE 8080

CMD [ "yarn", "start:prod" ]
