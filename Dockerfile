FROM node:10.17.0@sha256:93e9a9283f0e2ead937a8f77a2c72b18f80005c10b57b4f1cfd40d2b3aa6595f
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