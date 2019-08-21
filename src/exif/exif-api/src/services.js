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

/**
 * This callback is executed after exif extraction.
 * When exif is extracted from photo, 
 * this function bounces the response and 
 * calls database save action else it simply 
 * sends ack back to queue for moving onto next item.
 * @param {*} err 
 * @param {*} response 
 * @param {*} sendAckToQueue 
 */
function extractExifCallback(err, response, sendAckToQueue) {
    if (err !== null) {
        console.log(err);
        sendAckToQueue();
        return;
    }
    console.log('Extracted Exif: ', response);
    sendAckToQueue();
}

/**
 * grpc handler for exififyAlbum. Iterates and extracts 
 * exif for all the photos in a given album.
 * @param {*} message 
 */
function exififyAlbum(message, sendAckToQueue) {
    const exifCore= new kuruviProto.ExifCore(EXIF_CORE_ENDPOINT, credentials);
    const {albumName, photoName} = message;
    const caddyURL = utils.getCaddyURL(albumName, photoName);
    console.log("remote urls are : ", caddyURL);
    const extractExifRequest = {
        url: caddyURL
    }
    exifCore.extractExif(extractExifRequest,
        (err, response) => extractExifCallback(err, response, sendAckToQueue));
}

module.exports = {exififyAlbum}
