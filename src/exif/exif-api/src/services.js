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
const {createQueue} = require('./queue/send');
const {runQueueForAlbum} = require('./queue/receive');

function extractExifCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Extracted Exif: ', response);
}

/**
 * grpc handler for exififyAlbum. Iterates and extracts 
 * exif for all the photos in a given album.
 * @param {*} message 
 */
function exififyAlbum(message) {
    const exifCore= new kuruviProto.ExifCore(EXIF_CORE_ENDPOINT, credentials);
    const exififyAlbumRequest = message.request;
    const remoteURLList = utils.getRemoteURLList(exififyAlbumRequest);
    console.log("remote urls are : ", remoteURLList);
    const photoURL = remoteURLList[4];
    const extractExifRequest = {
        url: photoURL
    }
    createQueue(exififyAlbumRequest);
    runQueueForAlbum(exififyAlbumRequest.albumName);
    // exifCore.extractExif(extractExifRequest,extractExifCallback);
}

module.exports = {exififyAlbum}
