FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY static static
COPY tsconfig.* ./
COPY src src
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]