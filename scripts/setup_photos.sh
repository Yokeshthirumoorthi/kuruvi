# Copyright © 2019 Yokesh Thirumoorthi
# [This program is licensed under the "MIT License"]
# Please see the file LICENSE in the source
# distribution of this software for license terms.

# clone the exif-samples repo
git clone https://github.com/ianare/exif-samples.git

# retain only the jpg images and discard the rest
mkdir photos
cp -r exif-samples/jpg/. photos
rm -rf exif-samples

