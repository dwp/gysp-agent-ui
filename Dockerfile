FROM node:10.16.0@sha256:5f2e8ae1cda95e68b99475218786cf0f62ef8f368b4c6821518ac805438cc0fc
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