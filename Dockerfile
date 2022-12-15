FROM node:16-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 4741

CMD ["npm", "start"]