# select base image
FROM ubuntu:latest

# install dependencies
RUN apt-get update -qq 
RUN apt-get install -yqq nano tor

# copy support scripts
COPY . /app

# tor routing
EXPOSE 9050/tcp

# finalize
WORKDIR /root
ENTRYPOINT ["tor"]
