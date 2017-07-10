FROM node:8.1.2
MAINTAINER David Inga <david.inga@vizzuality.com>

RUN apt-get update && \
    apt-get install -y bash git build-essential \
    automake autoconf make g++ libtool libcairo2-dev
RUN npm install -g node-gyp --loglevel warn

# Create app directory
RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
