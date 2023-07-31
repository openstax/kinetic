FROM node:20-slim

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD [ "yarn" "run" "docker:dev" ]
