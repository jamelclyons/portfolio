FROM node:22

ARG AUTH_TOKEN
ENV AUTH_TOKEN=$AUTH_TOKEN

RUN test -n "$AUTH_TOKEN" || (echo "Token is NOT set" && exit 1)

WORKDIR /app

RUN git config --global --add safe.directory /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]