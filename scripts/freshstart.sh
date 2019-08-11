#!/bin/bash

# Copyright © 2019 Yokesh Thirumoorthi
# [This program is licensed under the "MIT License"]
# Please see the file LICENSE in the source
# distribution of this software for license terms.

# Cleanup any pre-existing docker entities
./docker-cleanup.sh

# Copy proto file into each service directories
./genproto.sh
echo "copied genproto into all services"
