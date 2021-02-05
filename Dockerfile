FROM node:14.15-alpine
LABEL maintainer="hello@vizzuality.com"

ARG apiEnv=production
ARG apiUrl=https://api.resourcewatch.org
ARG wriApiUrl=https://api.resourcewatch.org/v1
ARG WRI_API_URL_V2=https://api.resourcewatch.org/v2
ARG callbackUrl=https://resourcewatch.org/auth
ARG controlTowerUrl=https://api.resourcewatch.org
ARG RW_GOGGLE_API_TOKEN_SHORTENER=not_valid
ARG RW_MAPBOX_API_TOKEN=not_valid
ARG RW_FEATURE_FLAG_AREAS_V2=

ENV NODE_ENV production
ENV WRI_API_URL $wriApiUrl
ENV CONTROL_TOWER_URL $controlTowerUrl
ENV CALLBACK_URL $callbackUrl
ENV STATIC_SERVER_URL=
ENV APPLICATIONS rw
ENV ADD_SEARCH_KEY ea4c79622844ade140170b141c36f14f
ENV TRANSIFEX_LIVE_API fca0343bce994bf8ba3dcdeaab389136
ENV BING_MAPS_API_KEY PPB0chXATYqlJ5t8oMPp~8SV9SIe2D0Ntc5sW3HExZA~AqTJgLkvvOdot-y1QukRox537t604Je0pxhygfcraTQGVWr7Ko9LwPoS7-MHW0qY
ENV API_ENV $apiEnv
ENV GOOGLE_ANALYTICS UA-67196006-1
ENV BLOG_API_URL https://blog.resourcewatch.org/wp-json/wp/v2
ENV RW_GOGGLE_API_TOKEN_SHORTENER $RW_GOGGLE_API_TOKEN_SHORTENER
ENV BITLY_TOKEN e3076fc3bfeee976efb9966f49383e1a8fb71c5f
ENV PARDOT_NEWSLETTER_URL https://go.pardot.com/l/120942/2018-01-25/3nzl13
ENV RW_MAPBOX_API_TOKEN $RW_MAPBOX_API_TOKEN
ENV WRI_API_URL_V2 $WRI_API_URL_V2
ENV RW_FEATURE_FLAG_AREAS_V2 $RW_FEATURE_FLAG_AREAS_V2

RUN apk update && apk add --no-cache \
    build-base gcc bash git \
    cairo-dev pango-dev jpeg-dev


# Add app directory
WORKDIR /usr/src/app

# Copy app folders
COPY components ./components
COPY constants ./constants
COPY css ./css
COPY hooks ./hooks
COPY layout ./layout
COPY lib ./lib
COPY modules ./modules
COPY pages ./pages
COPY public ./public
COPY redactions ./redactions
COPY selectors ./selectors
COPY services ./services
COPY static ./static
COPY utils ./utils

# Copy single files

COPY .babelrc .
COPY .browserlistrc .
COPY package.json .
COPY yarn.lock .
COPY api.md .
COPY auth.js .
COPY index.js .
COPY next.config.js .
COPY next-sitemap.js .
COPY now.json .
COPY postcss.config.js .
COPY routes.js .
COPY store.js .

RUN yarn install --frozen-lockfile --production=false

RUN yarn build

COPY entrypoint.sh .

EXPOSE 3000

ENTRYPOINT ["sh", "./entrypoint.sh"]
