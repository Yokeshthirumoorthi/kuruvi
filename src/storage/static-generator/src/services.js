/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

function doExifBasedClassification(albumFolders) {
    console.log('Given Album folders req:', albumFolders);
}

function createExifFolders(call, callback) {
    callback(null, doExifBasedClassification(call.request));
}