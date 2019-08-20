/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const utils = require('./utils');

const {kuruviProto, credentials} = require('./common/grpc');
const {EXIF_CORE_ENDPOINT} = require('./common/config');


function extractExifCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Extracted Exif: ', response);
}

function exififyAlbum(message) {
    const exifCore= new kuruviProto.Exif(EXIF_CORE_ENDPOINT, credentials);
    const remoteURLList = utils.getRemoteURLList(message);
    console.log("remote urls are : ", remoteURLList);
    // exifCore.extractExif(message,extractExifCallback);
}

module.exports = {exififyAlbum}
