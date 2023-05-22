# use official node.js runtime as base image
FROM node:14-alpine

# set working dir in container
WORKDIR /app

# copy package.json and package-lock.json to working dir
COPY package*.json ./

# Install project dependencies
RUN npm install

# copy the rest of the application code to working dir
COPY . .

# build front-end application
RUN npm run build

# expose port on which front-end will run
EXPOSE 3000

# serve built front-end application
CMD ["npm", "start"]