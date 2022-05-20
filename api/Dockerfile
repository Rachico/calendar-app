FROM node:16.13 as base
WORKDIR /api-server
COPY package.json ./
FROM base as dev
ENV NODE_ENV=development
RUN yarn install
COPY . .