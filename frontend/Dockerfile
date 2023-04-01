FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]