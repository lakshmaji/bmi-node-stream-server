# BMI 

[![Lint, Build](https://github.com/lakshmaji/code-2022-lakshmaji/actions/workflows/lint_build.yml/badge.svg?branch=main)](https://github.com/lakshmaji/code-2022-lakshmaji/actions/workflows/lint_build.yml)

A sample express js API, to illustrate handling of JSON files at scale.

## Installation

1. Install project dependencies

    ```bash
    yarn install
    ```

2. Install redis

    1. You can follow the instructions [here](https://redis.io/docs/getting-started/installation/), or you can pull `redis` image to use with docker.

    ```bash
    docker run --name local-cache -p 6379:6379 redis
    ```

## Documentation

Swagger (OpenAPI spec): [Local version](http://localhost:3007/docs/)

## Development

```bash
yarn dev
```

OR

```bash
docker-compose up -d
```

## Monitor background tasks

Click [here](http://localhost:3007/admin/queues) or Open `http://localhost:3007/admin/queues` in browser

## TODO

- [ ] supertest (e2e only).
- [ ] The project contains minimal logging implementation, this can be improved.
- [ ] Most of the places using procedural paradigm (Could be functional or OOP oriented).
- [ ] Add cloud storage (space limitation with disk storage)
- [ ] Add auto deploy pipeline