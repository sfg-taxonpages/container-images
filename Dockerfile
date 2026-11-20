FROM node:24-alpine

WORKDIR /usr/src/app

ADD package.json .
RUN npm install && npm list

ADD . .
RUN npm run build:ssr

ENTRYPOINT ["/bin/sh", "/usr/src/app/entrypoint.sh"]

CMD ["npm", "run", "serve"]
