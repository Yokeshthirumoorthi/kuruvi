/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function doAlbumUpload(saveAlbumReq) {
    console.log('Given Album req:', saveAlbumReq);
}

function saveAlbumUpload(call, callback) {
    callback(null, doAlbumUpload(call.request));
}