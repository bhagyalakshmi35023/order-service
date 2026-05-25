FROM node:20-alpine

ARG SERVICE_DIR

WORKDIR /app

COPY ${SERVICE_DIR}/package*.json ./

RUN npm install production

COPY ${SERVICE_DIR}/ .

EXPOSE 3000

CMD ["node","index.js"]