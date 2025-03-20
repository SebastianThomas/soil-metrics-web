FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

FROM ubuntu:24.10
RUN apt-get update
RUN apt-get install nginx -y
WORKDIR /app
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
