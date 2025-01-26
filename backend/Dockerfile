FROM node:16
WORKDIR /app
COPY . .
RUN rm -rf .env
RUN npm ci
RUN npm run build
CMD [ "node", "dist/index.js" ]