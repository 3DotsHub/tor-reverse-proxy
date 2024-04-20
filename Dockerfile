# select base image
FROM node:latest

# install dependencies
RUN apt-get update -qq 
RUN apt-get install -yqq nano tor systemctl

# mkdir
RUN mkdir /data

# clone and install
RUN git clone https://github.com/3DotsHub/tor-reverse-proxy.git /data
WORKDIR /data/tor-reverse-proxy
RUN npm install

# tor routing
EXPOSE 9050/tcp

# finalize
ENTRYPOINT ["npm run start:prod"]
