#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM golang:1.12-alpine AS builder

ARG HUGO_VERSION="0.58.1"
ARG HUGO_NAME="hugo_${HUGO_VERSION}_Linux-64bit"
ARG HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.tar.gz"
ARG BUILD_DEPS="wget"

WORKDIR /hugo

RUN apk add \
    --no-cache \
    ca-certificates \
    ${BUILD_DEPS} \
    git && \
    wget "${HUGO_URL}" && \
    tar -zxvf "${HUGO_NAME}.tar.gz" && \
    mv ./hugo /usr/bin/hugo && \
    cd / && \
    rm -rf /hugo


WORKDIR /srv

COPY . .

RUN hugo && \
    go build -o main .

EXPOSE 8079

CMD ["./main"]
