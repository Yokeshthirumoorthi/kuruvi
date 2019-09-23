---
title: 'Docker Compose'
date: 2019-09-21T19:27:37+10:00
draft: false
weight: 2
summary: Setup the project using docker compose. Typically used for development.
---

## Kuruvi via Docker Compose

The Kuruvi application is packaged using a [Docker Compose](https://docs.docker.com/compose/) file.

<!-- ### Networking

In this version we create a Docker network and DNS is achieved by using the internal Docker DNS, which reads network alias entries provided by docker-compose. -->

### Pre-requisites

- Install [Docker](https://www.docker.com/products/overview)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install Java

### Installation

```
git clone https://github.com/Yokeshthirumoorthi/kuruvi.git
cd kuruvi
```

### Provision infrastructure

```
make deploy
```

### Reset infrastructure (including Volumes)

```
make reset
```

### Cleaning up

```
make clean
```

### Run the site

Once deployed goto http://localhost:8079