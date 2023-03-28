FROM node:16
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD [ "node", "dist/index.js" ]