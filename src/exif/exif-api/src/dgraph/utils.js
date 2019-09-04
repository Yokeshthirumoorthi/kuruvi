/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function getPhotoUIDQuery() {
    const query = `query photo($a: string) {
        all(func: eq(name, $a)) {
            uid
        }
    }`;
    return query;
}

function getAddExifQuery(exif, photoUID) {
    const query = [{
        "uid": "_:exif",
        ...exif,
        create_date: new Date(exif.create_on)
    },
    {
        "uid": photoUID,
        "exif": {
            "uid": "_:exif"
        }
    }];

    return query;
}

module.exports = {getPhotoUIDQuery, getAddExifQuery}