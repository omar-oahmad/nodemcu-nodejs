# use official node.js runtime as base image
FROM node:14-alpine

# set working dir in container
WORKDIR /app

# copy package.json and package-lock.json to working dir
COPY package*.json ./

# install project dependencies
RUN npm install

# copy the rest of the application code to working dir
COPY . .

# expose port on which the server will run
EXPOSE 3000

# start server
CMD ["npm", "start"]