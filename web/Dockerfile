FROM node:latest

WORKDIR /app

COPY web/package*.json ./
COPY web/vite.config.js ./

RUN npm config set registry https://registry.npmjs.org/
RUN mkdir node_modules
RUN npm ci --no-audit

COPY web .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]