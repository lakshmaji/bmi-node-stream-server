# BMI 

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

- [ ] Compute aggregate (BMI stats) (results will be cached to redis)
- [ ] List results
- [ ] supertest (e2e only).
- [ ] The project contains minimal logging implementation, this can be improved.
- [ ] Most of the places using procedural paradigm (Could be functional or OOP oriented).
- [ ] Improve download API performance
- [ ] Add cloud storage (space limitation)
- [ ] Add auto deploy pipeline