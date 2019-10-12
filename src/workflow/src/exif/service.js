const {kuruviProto, credentials} = require('../common/grpc');
const {EXIF_CORE_ENDPOINT} = require('../common/config');
const utils = require('./utils');

/**
 * This callback is executed after exif extraction.
 * When exif is extracted from photo, 
 * this function bounces the response and 
 * calls database save action else it simply 
 * sends ack back to queue for moving onto next item.
 * @param {*} err 
 * @param {*} response
 */
async function extractExifCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log("Exif : ", response);
}

/**
 * grpc handler for exififyAlbum. Iterates and extracts 
 * exif for all the photos in a given album.
 * @param {*} message 
 */
function exififyAlbum(message, nextJob) {
    const exifCore= new kuruviProto.ExifCore(EXIF_CORE_ENDPOINT, credentials);
    const {albumName, photoName} = message;
    const caddyURL = utils.getCaddyURL(albumName, photoName);
    console.log("remote urls are : ", caddyURL);
    const extractExifRequest = {
        url: caddyURL
    }
    exifCore.extractExif(extractExifRequest,async (err, res) => {
                extractExifCallback(err, res);
                // Call next job here
                nextJob()
            });
}

module.exports = {exififyAlbum}