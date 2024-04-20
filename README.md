## Description

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker Environment

### Create attachable swarm overlay network

```bash
# naming should be the namespace value e.g. torreverseproxy
docker network create --driver overlay --attachable torreverseproxy
```

### Attach network to all container and/or services.
