FROM node:slim

RUN apt update && apt install curl -y

# Declaring env
ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]