#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.

FROM abiosoft/caddy as base

# copy index file into root of caddy
FROM base

ARG CADDY_FRONTEND_PORT

COPY Caddyfile /etc
