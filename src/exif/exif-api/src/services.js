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
const dgraph = require('./dgraph');

function formatExifToSaveInDB (exif, predicate) {
    return {
        ...exif,
        exif_of: {
            name: predicate.photoName,
            belongs_to: {
                name: predicate.albumName
            }
        }
    }
}

function generateFolderStructureByExif(exifJson) {
    const tag1Photos = exifJson.all[0].photos.map(photo => photo.name);
    const albumFolders = {albums: [
        {albumName: 'album2', tagName: 'tag1', photos: tag1Photos},
        {albumName: 'album2', tagName: 'tag2', photos: ['bbt1.jpg', 'bbt4.jpg']}
    ]}
    // TODO: implement groupby functionality
    return albumFolders;
}

/**
 * 
 * After the photos are completely uploaded, 
 * the photo-details extraction process
 * is started. This function
 * helps in executing the process by calling 
 * each service in some defined order.
 * @param {*} albumInfo Contains the name of album to be processed
 */
async function organizePhotosByExif(albumName) {
    console.log("Inside organizePhotosByExif")
    const exif = await dgraph.queryData('album2');

    const folders = generateFolderStructureByExif(exif);
    console.log(folders);

    return folders;
}

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
function extractExifCallback(err, response, message, sendAckToQueue) {
    if (err !== null) {
        console.log(err);
        sendAckToQueue();
        return;
    }
    console.log('Extracted Exif: ', response);
    const data  = formatExifToSaveInDB(response, message);
    // dgraph.createData(data).then(sendAckToQueue);
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
        (err, response) => extractExifCallback(err, response, message, sendAckToQueue));
}

module.exports = {exififyAlbum, organizePhotosByExif}
