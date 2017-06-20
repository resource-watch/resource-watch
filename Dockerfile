FROM node:8.1-alpine

ENV NAME resource-watch

RUN apk update && apk upgrade && \
    apk add --no-cache --update bash git

RUN mkdir /opt/$NAME && cd /opt/$NAME
COPY ./package.json /opt/$NAME/package.json
COPY ./npm-shrinkwrap.json /opt/$NAME/npm-shrinkwrap.json
RUN cd /opt/$NAME && npm install

WORKDIR /opt/$NAME/app
COPY . /opt/$NAME/app

EXPOSE 8000

CMD ["npm", "start"]
