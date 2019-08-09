#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM node:8

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get install -y curl && \
    DEBIAN_FRONTEND=noninteractive && \
    # Install Git
    apt-get install -y git && \
    # Install Java
    apt-get -y install default-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    # Install Caddy
    curl https://getcaddy.com | bash -s personal

COPY . .

RUN chmod +x installPhotoFloat.sh
RUN ./installPhotoFloat.sh

# copy upload file into root of caddy
COPY upload.html /usr/src/app/PhotoFloat/web/

EXPOSE 2020

COPY Caddyfile /etc

CMD ["caddy"]