# select base image
FROM node:21

# install dependencies
RUN apt-get update -qq
RUN apt-get install -yqq nano tor

# mkdir
RUN mkdir /data

# clone and install
RUN git clone https://github.com/3DotsHub/tor-reverse-proxy.git /data

# install and build
WORKDIR /data
RUN npm install
RUN npm run build

# tor routing
EXPOSE 9050/tcp

# finalize
CMD ["npm", "run", "start:prod"]