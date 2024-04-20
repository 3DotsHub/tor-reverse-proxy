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
docker build --tag tor-reverse-proxy:0.0.1 --no-cache .
```

### Create attachable swarm overlay network

```bash
# naming should be the namespace value e.g. torreverseproxy
docker network create --driver overlay --attachable torreverseproxy
```

### Develop application inside the container

if you have docker desktop running, you can develop locally inside the container.

```bash
# run app with tor-reverse-proxy:0.0.1 image
docker run -dit --rm --mount type=bind,source="$(pwd)",target=/app --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock --network torreverseproxy tor-reverse-proxy:0.0.1 npm run start:dev

# or run app as node image and manually install deps, if neccessary
ocker run -dit --rm --mount type=bind,source="$(pwd)",target=/app --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock --network torreverseproxy node bash -c "cd /app && npm run start:dev"
docker exec -it <container-id> apt-get update -qq
docker exec -it <container-id> apt-get install -yqq nano tor

# follow logs
docker logs -f --tail 1000 <container-id>

# run clients
docker run -dit --rm -e HIDDENSERVICE_PROFILE=alice -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
docker run -dit --rm -e HIDDENSERVICE_PROFILE=bob -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
docker run -dit --rm -e HIDDENSERVICE_PROFILE=charlie -e HIDDENSERVICE_NAMESPACE=torreverseproxy --network torreverseproxy nginx
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

# or logs

docker logs -f --tail 1000 <container-id>
```

### Attach volumes to Tor container and/or services, if needed.

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

## tor-reverse-proxy APP Example Output

```bash
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [NestFactory] Starting Nest application...
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [InstanceLoader] DiscoveryModule dependencies initialized +39ms
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [InstanceLoader] ScheduleModule dependencies initialized +0ms
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [NestApplication] Nest application successfully started +25ms
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Tor service running: false
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [AppWorkflow] Scanning for valid containers... --namespace torreverseproxy
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [AppWorkflow] Validated container list updated. Entries: 3
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Tor service stopped.
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [AppWorkflow] Tor.stopped: true
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Applying rule in behalf of ab0090b1d06e for charlie at 10.0.20.51:80
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Applying rule in behalf of 128dee7c0248 for bob at 10.0.20.49:80
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Applying rule in behalf of 6561a8b157a8 for alice at 10.0.20.47:80
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Writing rules successful.
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [AppWorkflow] Tor.writeRules: true
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [TorControl] Tor service started.
[Nest] 19  - 04/20/2024, 11:05:37 AM     LOG [AppWorkflow] Tor.started: true
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [AppWorkflow] Scanning for valid containers... --namespace torreverseproxy
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [AppWorkflow] Tor.running: true, Tor.restart: false
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Applied rule in behalf of ab0090b1d06e for charlie at 10.0.20.51:80
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Profile charlie at is6qe4fxxxxxxxxxxxxxxxxxxxxxxerggxeqzyd.onion
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Applied rule in behalf of 128dee7c0248 for bob at 10.0.20.49:80
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Profile bob at oghrynqkwwddddddddddddddddddd6peyt3xfusq54biumqd.onion
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Applied rule in behalf of 6561a8b157a8 for alice at 10.0.20.47:80
[Nest] 19  - 04/20/2024, 11:05:42 AM     LOG [TorControl] Profile alice at 5ev75jltggggggggggggggggggggglvmcbhr4xpr4cgzb4yd.onion
```
