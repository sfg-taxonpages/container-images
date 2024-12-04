FROM node:20-alpine

WORKDIR /usr/src/app

ADD package.json package-lock.json .
RUN npm install

ADD . .
RUN npm run build:ssr

CMD npm run serve

