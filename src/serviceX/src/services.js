/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function doSavePhoto(savePhotoReq) {
    console.log('Given Photo req:', savePhotoReq);
}

function savePhoto(call, callback) {
    callback(null, doSavePhoto(call.request));
}

module.exports = {savePhoto}