FROM node:10.16.0@sha256:2c0459e6f7fb62543b4ca30d4efcd0edd860224c86187c808f1975e811be1f00
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ADD certs/* ./certs/

# RUN npm install
RUN npm install -g nodemon
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8100
CMD [ "node", "server.js" ]