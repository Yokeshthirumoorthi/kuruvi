#!/bin/bash

# Copyright © 2019 Yokesh Thirumoorthi
# [This program is licensed under the "MIT License"]
# Please see the file LICENSE in the source
# distribution of this software for license terms.

cd ../src
cd ./imguploadservice/scripts && ./genproto.sh
cd ../../pgsqlservice/scripts && ./genproto.sh
cd ../../exifservice && ./genproto.sh
cd ../imgproxyservice/scripts && ./genproto.sh
cd ../../faceapi/scripts && ./genproto.sh
