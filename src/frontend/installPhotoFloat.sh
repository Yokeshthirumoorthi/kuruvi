#!/bin/bash -eu
#
#
#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.
#
# Credits : https://git.zx2c4.com/PhotoFloat

# More details about installation is found in here
# https://git.zx2c4.com/PhotoFloat/about/
git clone git://git.zx2c4.com/PhotoFloat && \
cd PhotoFloat && \
rm web/js/999-googletracker.js && \
cd web && \
make