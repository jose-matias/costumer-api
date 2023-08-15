# customer-api

## Set environment variables

```bash
KEYCLOAK_REALM=
KEYCLOAK_BASE_URL=

REDIS_HOST=
REDIS_PORT=
```
* Keycloak url example:
`KEYCLOAK_BASE_URL`/auth/realms/`KEYCLOAK_REALM`/protocol/openid-connect ...
## Installation

```bash
$ npm run install
```

## Running the app container

```bash
# development
$ docker compose -f docker-compose.dev.yml up -d

# production mode
$ docker compose -f docker-compose.prod.yml up -d
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
