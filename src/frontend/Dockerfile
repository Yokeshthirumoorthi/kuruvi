#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM abiosoft/caddy AS base
FROM debian:10-slim AS builder

ARG HUGO_VERSION="0.58.1"
ARG HUGO_NAME="hugo_${HUGO_VERSION}_Linux-64bit"
ARG HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.tar.gz"
ARG BUILD_DEPS="wget"

WORKDIR /hugo

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ${BUILD_DEPS} \
    git \
    ca-certificates && \
    wget "${HUGO_URL}" && \
    tar -zxvf "${HUGO_NAME}.tar.gz" && \
    mv ./hugo /usr/bin/hugo && \
    apt-get remove -y ${BUILD_DEPS} && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    cd / && \
    rm -rf /hugo

WORKDIR /src

COPY . .

RUN hugo

FROM base

COPY --from=builder /src/public /srv

COPY Caddyfile /etc