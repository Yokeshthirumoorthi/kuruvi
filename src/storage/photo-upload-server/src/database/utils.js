/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function getAddPhotoQuery(photoName, albumUID) {
    const query = [{
        "uid": "_:photo",
        "name": photoName
    },
    {
        "uid": albumUID,
        "photos": {
            "uid": "_:photo"
        }
    }];

    return query;
}

function getAlbumUIDQuery() {
    const query = `query album($a: string) {
        all(func: eq(name, $a)) {
            uid
        }
    }`; 

    return query;
}

module.exports = {getAddPhotoQuery, getAlbumUIDQuery}