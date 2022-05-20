FROM node:16.13
WORKDIR /client
COPY package.json /client
RUN yarn install
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . /client