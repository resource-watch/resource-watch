FROM node:8.14.0-alpine

ARG apiEnv=production
ARG apiUrl=https://resourcewatch.org/api
ARG wriApiUrl=https://api.resourcewatch.org/v1
ARG callbackUrl=https://resourcewatch.org/auth
ARG controlTowerUrl=https://production-api.globalforestwatch.org
ARG RW_GOGGLE_API_TOKEN_SHORTENER=not_valid

ENV NODE_ENV production
ENV WRI_API_URL $wriApiUrl
ENV API_URL $apiUrl
ENV CONTROL_TOWER_URL $controlTowerUrl
ENV CALLBACK_URL $callbackUrl
ENV STATIC_SERVER_URL=
ENV APPLICATIONS rw
ENV ADD_SEARCH_KEY ea4c79622844ade140170b141c36f14f
ENV TRANSIFEX_LIVE_API fca0343bce994bf8ba3dcdeaab389136
ENV BING_MAPS_API_KEY PPB0chXATYqlJ5t8oMPp~8SV9SIe2D0Ntc5sW3HExZA~AqTJgLkvvOdot-y1QukRox537t604Je0pxhygfcraTQGVWr7Ko9LwPoS7-MHW0qY
ENV API_ENV $apiEnv
ENV GOOGLE_ANALYTICS UA-67196006-1
ENV BLOG_API_URL https://resourcewatch.org/blog/wp-json/wp/v2
ENV RW_GOGGLE_API_TOKEN_SHORTENER $RW_GOGGLE_API_TOKEN_SHORTENER
ENV BITLY_TOKEN e3076fc3bfeee976efb9966f49383e1a8fb71c5f

RUN apk update && apk add --no-cache \
    build-base gcc bash git \
    cairo-dev

# Add app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile --no-cache --production

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
