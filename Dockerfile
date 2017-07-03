FROM node:8.1.2

ENV NODE_ENV production
USER root

RUN apt-get update && \
    apt-get install -y bash git build-essential \
    automake autoconf make g++ libtool libcairo2-dev
RUN npm install -g node-gyp --loglevel warn

# Create app directory
RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY npm-shrinkwrap.json /usr/src/app/
RUN yarn install

# Bundle app source
COPY . /usr/src/app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
