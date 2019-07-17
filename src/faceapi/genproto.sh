#!/bin/bash -eu
#
#
#  Copyright © 2019 Yokesh Thirumoorthi.
#
#  [This program is licensed under the "MIT License"]
#  Please see the file LICENSE in the source
#  distribution of this software for license terms.
#

# protos are loaded dynamically for node, simply copies over the proto.
mkdir -p proto
cp -r ../../pb/* ./proto
