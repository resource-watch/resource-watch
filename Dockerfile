FROM node:8.1.2

ENV NODE_ENV production
ENV WRI_API_URL https://api.resourcewatch.org/v1
ENV BASEMAP_TILE_URL https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png
ENV API_URL https://staging.resourcewatch.org/api
ENV CONTROL_TOWER_URL https://production-api.globalforestwatch.org
ENV CALLBACK_URL https://staging.resourcewatch.org/auth
ENV STATIC_SERVER_URL=
ENV APPLICATIONS rw
ENV OPBEAT_ORG_ID 17ab8eb501d2418a81f3167c10407e90
ENV OPBEAT_APP_ID 7170680c2a
ENV ADD_SEARCH_KEY cb7e797b8a3c0d09c323955f0c4f957a
ENV TRANSIFEX_LIVE_API fca0343bce994bf8ba3dcdeaab389136
ENV GOGGLE_API_TOKEN_SHORTENER AIzaSyAf0lJIKq32sQwrfiOKx0T6yFWnonbfOso
ENV BING_MAPS_API_KEY PPB0chXATYqlJ5t8oMPp~8SV9SIe2D0Ntc5sW3HExZA~AqTJgLkvvOdot-y1QukRox537t604Je0pxhygfcraTQGVWr7Ko9LwPoS7-MHW0qY
ENV API_ENV production,preproduction
ENV GOOGLE_ANALYTICS UA-67196006-1

RUN apt-get update && \
    apt-get install -y bash git build-essential \
    automake autoconf make g++ libtool libcairo2-dev \
    && npm install -g node-gyp --loglevel warn \
    && mkdir -p /usr/src/app && mkdir -p /usr/src/app

# Add app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn cache clean
RUN yarn install

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
