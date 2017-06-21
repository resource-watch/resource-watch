FROM node:6.11-alpine

ENV USER resource-watch

RUN apk update && apk upgrade && \
    apk add --no-cache --update bash git build-base \
    automake autoconf libtool cairo-dev nasm
RUN npm install -g node-gyp
RUN addgroup $USER && adduser -s /bin/bash -D -G $USER $USER
USER $USER

COPY ./package.json /home/$USER/package.json
RUN cd /home/$USER && npm install

WORKDIR /home/$USER/app
COPY . /home/$USER/app

EXPOSE 3000

CMD ["npm", "start"]
