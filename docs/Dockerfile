FROM abiosoft/caddy AS base
FROM debian:10-slim AS builder

ARG HUGO_VERSION="0.58.1"
ARG HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
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

## hugo whisper theme
# RUN hugo new site mynewsite && \
#     cd mynewsite && \
#     git clone https://github.com/jugglerx/hugo-whisper-theme.git themes/hugo-whisper-theme && \
#     cp -a themes/hugo-whisper-theme/exampleSite/. . && \
#     rm -rvf content

## higo book theme
RUN hugo new site mynewsite && \
    cd mynewsite && \
    git init && \
    git submodule add https://github.com/alex-shpak/hugo-book themes/book && \
    cp -R themes/book/exampleSite/content . && \
    rm -rvf content

COPY . /src/mynewsite

RUN cd /src/mynewsite && \
    hugo --minify --theme book

FROM base

ARG DOCS_SITE_PORT
ENV DOCS_SITE_PORT ${DOCS_SITE_PORT}

COPY --from=builder /src/mynewsite/public /srv

COPY Caddyfile /etc