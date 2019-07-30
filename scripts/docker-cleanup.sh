#!/bin/bash

# Copyright © 2019 Yokesh Thirumoorthi
# [This program is licensed under the "MIT License"]
# Please see the file LICENSE in the source
# distribution of this software for license terms.

# stop all containers
docker stop --force $(docker ps -a -q)

# destroy all containers
docker rm --force $(docker ps -a -q)

# destroy all images
docker rmi --force $(docker images -q)

# destroy all volumes
docker volume rm $(docker volume ls -q --filter dangling=true)

# remove if something is still dangling
docker system prune