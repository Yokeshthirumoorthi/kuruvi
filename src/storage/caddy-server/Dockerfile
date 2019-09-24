#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM abiosoft/caddy as base

# copy index file into root of caddy
FROM base

ARG CADDY_SERVER_PORT
ARG PHOTO_UPLOAD_SERVER_SERVICE
ARG PHOTO_UPLOAD_SERVER_PORT

ENV CADDY_SERVER_PORT $CADDY_SERVER_PORT
ENV PHOTO_UPLOAD_SERVER_SERVICE $PHOTO_UPLOAD_SERVER_SERVICE
ENV PHOTO_UPLOAD_SERVER_PORT $PHOTO_UPLOAD_SERVER_PORT

COPY Caddyfile /etc

EXPOSE $CADDY_SERVER_PORT