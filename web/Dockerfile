FROM node:latest



WORKDIR /app

COPY web/package*.json ./
COPY web/vite.config.js ./

RUN npm config set registry https://registry.npmjs.org/
RUN mkdir node_modules
RUN npm ci --no-audit

COPY web .

# Set environment variables
ARG VITE_API_URL
ARG VITE_WEB_URL
ARG VITE_MINIO_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WEB_URL=$VITE_WEB_URL
ENV VITE_MINIO_URL=$VITE_MINIO_URL


EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]