#!/bin/bash

# stop docker container
docker stop imgproxyservice

# remove docker container
docker rm imgproxyservice

# copy the proto
./genproto.sh

# rebuild docker image
docker build -t kuruvi_imgproxyservice ../

# build docker container
docker run -d \
    --name=imgproxyservice \
    --network=kuruvi_nest \
    -p 50053:50053 \
    -v kuruvi_albums:/usr/src/app/uploads \
    -v kuruvi_resized_albums:/usr/src/app/resized \
    kuruvi_imgproxyservice