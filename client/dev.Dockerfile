FROM node:16.13.1-alpine3.13

WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .