/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function getAlbumDetailsQuery() {
    const query = `query album($a: string) {
        all(func: eq(name, $a)) {
            uid
            name
            photos {
                uid
                name
                exif {
                    uid
                    create_on
                    make
                    height
                    create_date
                    width
                    model
                    name
                }
            }
        }
    }`; 

    return query;
}

module.exports = {getAlbumDetailsQuery}