FROM node:22

WORKDIR /app

COPY package.json ./

COPY .npmrc .npmrc

COPY tsconfig.json ./

ARG GITHUB_TOKEN

RUN echo "@the7ofdiamonds:registry=https://npm.pkg.github.com/" > .npmrc \
 && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

RUN npm install --legacy-peer-deps

COPY . .

RUN rm -f .npmrc

EXPOSE 3000

CMD ["npm", "run", "dev"]