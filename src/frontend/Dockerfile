#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM alpine

# deps for post-install scripts
RUN apk add --update --no-cache \
    openjdk8 \
    make \
    git \
    caddy

# Create app directory
WORKDIR /usr/src/app

# Credits : https://git.zx2c4.com/PhotoFloat
# More details about installation is found in here
# https://git.zx2c4.com/PhotoFloat/about/
RUN git clone git://git.zx2c4.com/PhotoFloat && \
    cd PhotoFloat && \
    rm web/js/999-googletracker.js && \
    cd web && \
    make

COPY . .

# copy upload file into root of caddy
COPY upload.html /usr/src/app/PhotoFloat/web/

EXPOSE 2020

COPY Caddyfile /etc

CMD ["caddy"]