FROM node:slim as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:slim

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app

# Serve the static files
CMD serve -s . -l $PORT