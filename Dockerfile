FROM node:14-buster
CMD npm run start

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "run", "start" ]