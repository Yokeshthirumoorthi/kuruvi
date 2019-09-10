#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM abiosoft/caddy as base

FROM base as builder

ARG FRONTEND_PORT

# copy index file into root of caddy

FROM base

COPY Caddyfile /etc
COPY index.html .

EXPOSE $FRONTEND_PORT