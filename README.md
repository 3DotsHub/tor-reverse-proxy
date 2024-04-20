# Description

_tor-reverse-proxy_ for Docker Swarm Overlay Network is an APP, written in NestJS and TypeScript, which automatically detects containers and services within the overlay network, applying TOR service rules based on user-defined HIDDENSERVICE keywords. This application seamlessly integrates TOR anonymity with Docker Swarm, enabling secure and private access to services while preserving anonymity through dynamic reverse proxy configurations.

### Application Env

The app utilizes environment variables such as INTERVAL=10000 for setting the scanning interval to 10 seconds, SOCKETPATH=/var/run/docker.sock to specify the Docker daemon's socket path, and NAMESPACE=torreverseproxy to define the application's namespace within the Docker Swarm overlay network.

```
INTERVAL=10000
SOCKETPATH=/var/run/docker.sock
NAMESPACE=torreverseproxy
```

# Docker Environment

### Build image

```bash
docker build --tag tor-reverse-proxy:0.0.1 .
```

### Create attachable swarm overlay network

```bash
# naming should be the namespace value e.g. torreverseproxy
docker network create --driver overlay --attachable torreverseproxy
```

### Run application

```bash
docker run -dit --rm --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock -e NAMESPACE=torreverseproxy --network torreverseproxy tor-reverse-proxy:0.0.1

docker run -dit --rm -e HIDDENSERVICE_PROFILE=alice -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
docker run -dit --rm -e HIDDENSERVICE_PROFILE=bob -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
docker run -dit --rm -e HIDDENSERVICE_PROFILE=charlie -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
```

### Get profiles onion hostname

```bash
docker exec -it <tor-reverse-proxy-condainer-id> cat /var/lib/tor/<profile>/hostname

# or print all *

docker exec -it <tor-reverse-proxy-condainer-id> cat /var/lib/tor/*/hostname
```

### Attach volumes to Tor container and/or services.

```
Config file
'/etc/tor/torrc'

Profiles dir
'/var/lib/tor/'
```

# Docker Service YML

Check out "Environment" folder for examples.

### Volume for profiles

```bash
# example to persist profiles in docker
volumes:
	- profiles:/var/lib/tor/
	- /var/run/docker.sock:/var/run/docker.sock:ro
```

### Deploying stacks and services

```bash
# create independent external network overlay, naming: torreverseproxy
docker network create --driver overlay --attachable torreverseproxy

# tor-reverse-proxy.yml deploys the reverse proxy app service
docker stack deploy -c Environment/tor-reverse-proxy.yml tor-reverse-proxy

# nginx-clients.yml deploys 3 nginx services for reverse proxy testing
docker stack deploy -c Environment/nginx-clients.yml nginx-clients
```
