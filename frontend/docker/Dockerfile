FROM node:14

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3008

CMD [ "yarn" "run" "docker:dev" ]
