FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 10000

CMD [ "npm", "start" ]