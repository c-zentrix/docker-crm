#Specify a base image
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

#Copy the dependencies file
COPY ./package.json ./

#Install dependencies
RUN npm install 

#Copy remaining files
COPY ./ ./

#Default command
CMD ["npm","start"]