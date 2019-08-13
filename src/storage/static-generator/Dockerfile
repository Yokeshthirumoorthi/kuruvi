#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM node:12-alpine AS base

FROM base AS node-builder

WORKDIR /srv

COPY package*.json ./

RUN npm install --only=production

FROM openjdk:8-alpine AS java-builder

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

FROM base

USER root

# REF: https://github.com/python-pillow/Pillow/blob/c05099f45c0d94a2a98c3609a96bdb6cf7446627/depends/alpine_Dockerfile
RUN apk --no-cache add python \
                       build-base \
                       python-dev \
                       py-pip \
                       # Pillow depenencies
                       jpeg-dev \
                       zlib-dev \
                       freetype-dev \
                       lcms2-dev \
                       openjpeg-dev \
                       tiff-dev \
                       tk-dev \
                       tcl-dev
WORKDIR /srv

# install from pip, without webp
RUN LIBRARY_PATH=/lib:/usr/lib /bin/sh -c "pip install Pillow"

COPY --from=node-builder /srv/node_modules ./node_modules
COPY . .
COPY --from=java-builder /srv/PhotoFloat .

EXPOSE 8001

CMD ["node", "index.js"]
