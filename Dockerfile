FROM node:22-alpine AS build

ARG AUTH_TOKEN
ENV AUTH_TOKEN=$AUTH_TOKEN

RUN test -n "$AUTH_TOKEN" || (echo "Token is NOT set" && exit 1)

WORKDIR /app

ARG AUTH_TOKEN
ENV AUTH_TOKEN=$AUTH_TOKEN

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]