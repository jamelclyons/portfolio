FROM node:22

WORKDIR /app

COPY package.json ./

COPY .npmrc .npmrc

COPY tsconfig.json ./

ARG GITHUB_TOKEN

# Create npmrc dynamically (THIS is the key)
RUN echo "@the7ofdiamonds:registry=https://npm.pkg.github.com/" > .npmrc \
 && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

# Install dependencies (hoist & link workspaces)
RUN npm install --legacy-peer-deps

# Copy app source only
COPY . .

RUN rm -f .npmrc

EXPOSE 3000

CMD ["npm", "run", "build"]