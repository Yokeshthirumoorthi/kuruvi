#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM openjdk:8-alpine AS builder

# Create app directory
WORKDIR /srv

RUN apk add --update --no-cache \
        make \
        git

# Credits : https://git.zx2c4.com/PhotoFloat
# More details about installation is found in here
# https://git.zx2c4.com/PhotoFloat/about/
RUN git clone git://git.zx2c4.com/PhotoFloat && \
    cd PhotoFloat && \
    rm web/js/999-googletracker.js && \
    cd web && \
    make

FROM abiosoft/caddy as base

# Create app directory
WORKDIR /srv

COPY --from=builder /srv/PhotoFloat/web .

# copy upload file into root of caddy
COPY upload.html .
COPY Caddyfile /etc
