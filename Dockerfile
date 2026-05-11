FROM node:24-alpine

WORKDIR /usr/src/app

ADD package.json .
RUN npm install

ADD . .
RUN npm run build:ssr

CMD npm run serve

