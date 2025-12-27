FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p /app/test-data

EXPOSE 3001

CMD ["node", "src/index.js"]
