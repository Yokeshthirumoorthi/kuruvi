#!/bin/bash

# Copyright © 2019 Yokesh Thirumoorthi
# [This program is licensed under the "MIT License"]
# Please see the file LICENSE in the source
# distribution of this software for license terms.

# It is required that db docker container is already running 

# stop container ig already created
docker stop dbmigrateservice && docker rm dbmigrateservice

# build image
docker build -t dbmigrateservice ../src/dbmigrateservice

# run container
docker run --network=kuruvi_nest --name=dbmigrateservice dbmigrateservice

# do the migration
docker exec dbmigrateservice /bin/sh diesel migration run