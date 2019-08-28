/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

// const utils = require('./utils');

// const {kuruviProto, credentials} = require('./common/grpc');
// const {EXIF_CORE_ENDPOINT} = require('./common/config');
// const dgraph = require('./dgraph');
// const _ = require('lodash');
// const moment = require('moment');

// function generateFolderStructureByExif(exifJson) {
//     // const otherPhotos = exifJson.all[0].photos.filter(photo => photo.exif.create_on === '');
//     const photos = exifJson.all[0].photos;

//     console.log("exifjson", exifJson);


//     const photosWithExif = photos.map(photo => {
//         console.log("photo:", photo);
//         return {name: photo.name, date: photo.exif[0].create_on} 
//     });
    
//     console.log("PHotoswithexif", photosWithExif);

//     var groupedResults = _.groupBy(photosWithExif, function (result) {
//         return moment(result.date).format("hA");
//     });

//     const albumTags = Object.keys(groupedResults).map(tagName => {
//         const photos = groupedResults[tagName].map(photo => photo.name);
//         return {
//             albumName: 'album2',
//             tagName: tagName,
//             photos: photos
//         }
//     });

//     console.log(groupedResults);

//     const albumFolders = {albums: albumTags};

//     return albumFolders;
// }

// /**
//  * 
//  * After the photos are completely uploaded, 
//  * the photo-details extraction process
//  * is started. This function
//  * helps in executing the process by calling 
//  * each service in some defined order.
//  * @param {*} albumInfo Contains the name of album to be processed
//  */
// async function organizePhotosByExif(albumName) {
//     console.log("Inside organizePhotosByExif")
//     const exif = await dgraph.queryData('album2');

//     console.log("Query album: ", exif)

//     const folders = generateFolderStructureByExif(exif);
//     console.log(folders);

//     return folders;
// }

// /**
//  * This callback is executed after exif extraction.
//  * When exif is extracted from photo, 
//  * this function bounces the response and 
//  * calls database save action else it simply 
//  * sends ack back to queue for moving onto next item.
//  * @param {*} err 
//  * @param {*} response 
//  * @param {*} sendAckToQueue 
//  */
// async function extractExifCallback(err, response, message, sendAckToQueue) {
//     if (err !== null) {
//         console.log(err);
//         sendAckToQueue();
//         return;
//     }
//     const photoName = message.photoName;
//     const albumUID = await dgraph.getAlbumUID(message.albumName);
//     await dgraph.addPhoto(photoName, albumUID);
//     const photoUID = await dgraph.getPhotoUID(photoName);
//     console.log("Photo UID: ", photoUID);
//     await dgraph.addExif(response, photoUID);
//     sendAckToQueue();
// }

// /**
//  * grpc handler for exififyAlbum. Iterates and extracts 
//  * exif for all the photos in a given album.
//  * @param {*} message 
//  */
// function exififyAlbum(message, sendAckToQueue) {
//     const exifCore= new kuruviProto.ExifCore(EXIF_CORE_ENDPOINT, credentials);
//     const {albumName, photoName} = message;
//     const caddyURL = utils.getCaddyURL(albumName, photoName);
//     console.log("remote urls are : ", caddyURL);
//     const extractExifRequest = {
//         url: caddyURL
//     }
//     exifCore.extractExif(extractExifRequest,
//         (err, response) => extractExifCallback(err, response, message, sendAckToQueue));
// }

// module.exports = {exififyAlbum, organizePhotosByExif}

const { FACEAPI_SERVICE_API_ENDPOINT } = require('./common/config');
const {fileUploaderProto, fileUploader_credentials} = require('./common/grpc_temp');
const detectFaces_fileUploader = new fileUploaderProto.FaceApiService(FACEAPI_SERVICE_API_ENDPOINT, fileUploader_credentials);

/** TODO: Use this function until we completely
 * get rid of fileUploader.proto
 */
function doSavePhoto_fileUploader(detectFaceRequest, sendAckToQueue) {
    detectFaces_fileUploader.detectFaces(detectFaceRequest, (err, res) => {
        console.log("Detect faces Res: ", res);
        sendAckToQueue();
    })
}

module.exports = {doSavePhoto_fileUploader}