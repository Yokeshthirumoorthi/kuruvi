#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

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

FROM python:3.7-alpine

# Pillow depenencies
RUN apk --no-cache add build-base \
                       jpeg-dev \
                       zlib-dev \
                       freetype-dev \
                       lcms2-dev \
                       openjpeg-dev \
                       tiff-dev \
                       tk-dev \
                       tcl-dev

WORKDIR /srv

RUN pip install Pillow

COPY --from=java-builder /srv/PhotoFloat .

EXPOSE 5001
