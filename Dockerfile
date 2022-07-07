FROM node:14.17-alpine
LABEL maintainer="hello@vizzuality.com"

ARG NEXT_PUBLIC_AUTH_CALLBACK=https://resourcewatch.org/auth-callback
ARG NEXTAUTH_URL=https://resourcewatch.org
ARG NEXTAUTH_JWT_SECRET=thisIsAVeryBadSecret
ARG NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER=not_valid
ARG NEXT_PUBLIC_RW_MAPBOX_API_TOKEN=not_valid
ARG NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN=not_valid
ARG NEXT_PUBLIC_WRI_API_URL=https://api.resourcewatch.org
ARG NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD=false
ARG NEXT_PUBLIC_API_ENV=production
ARG NEXT_PUBLIC_ENVS_SHOW=production
ARG NEXT_PUBLIC_ENVS_EDIT=production

ENV NEXT_PUBLIC_ADD_SEARCH_KEY ea4c79622844ade140170b141c36f14f
ENV NEXT_PUBLIC_API_ENV $NEXT_PUBLIC_API_ENV
ENV NEXT_PUBLIC_APPLICATIONS rw
ENV NEXT_PUBLIC_BITLY_TOKEN e3076fc3bfeee976efb9966f49383e1a8fb71c5f
ENV NEXT_PUBLIC_BLOG_API_URL https://blog.resourcewatch.org/wp-json/wp/v2
ENV NEXT_PUBLIC_AUTH_CALLBACK $NEXT_PUBLIC_AUTH_CALLBACK
ENV NEXTAUTH_URL $NEXTAUTH_URL
ENV NEXTAUTH_JWT_SECRET $NEXTAUTH_JWT_SECRET
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS UA-67196006-1
ENV NODE_ENV production
ENV NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER $NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER
ENV NEXT_PUBLIC_RW_MAPBOX_API_TOKEN $NEXT_PUBLIC_RW_MAPBOX_API_TOKEN
ENV NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN $NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN
ENV NEXT_PUBLIC_WRI_API_URL $NEXT_PUBLIC_WRI_API_URL
ENV NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD $NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD
ENV NEXT_PUBLIC_ENVS_SHOW $NEXT_PUBLIC_ENVS_SHOW
ENV NEXT_PUBLIC_ENVS_EDIT $NEXT_PUBLIC_ENVS_EDIT

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
COPY hoc ./hoc
COPY layout ./layout
COPY lib ./lib
COPY modules ./modules
COPY pages ./pages
COPY public ./public
COPY redactions ./redactions
COPY selectors ./selectors
COPY services ./services
COPY server ./server
COPY utils ./utils
COPY test ./test
COPY types ./types
COPY scripts ./scripts
# stop copying this folder when the user is not stored in the global state
# (see https://github.com/resource-watch/resource-watch/blob/develop/pages/_app.jsx#L22)
COPY cypress ./cypress
COPY .yarn ./.yarn

# Copy single files
COPY .babelrc .
COPY .browserlistrc .
COPY .env.test .
COPY .env.production .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY index.js .
COPY next-env.d.ts .
COPY next-sitemap.js .
COPY next.config.js .
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .

RUN yarn install --immutable

RUN yarn build

COPY entrypoint.sh .

EXPOSE 3000

ENTRYPOINT ["sh", "./entrypoint.sh"]
