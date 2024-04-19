# select base image
FROM node:latest

# install dependencies
RUN apt-get update -qq 
RUN apt-get install -yqq nano tor systemctl

# copy support scripts
# COPY . /app

# tor routing
EXPOSE 9050/tcp

# finalize
WORKDIR /app
# ENTRYPOINT ["npm run start:dev"]
