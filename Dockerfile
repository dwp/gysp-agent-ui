FROM node:10.19.0@sha256:a9d108f82e34c84e6e2a9901fda2048b9f5a40f614c3ea1348cbf276a7c2031c
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