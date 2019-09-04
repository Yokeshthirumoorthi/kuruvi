/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {kuruviProto, credentials} = require('./common/grpc');
const {STATIC_GENERATOR_ENDPOINT, EXIF_API_ENDPOINT,
    FACE_API_ENDPOINT, RESIZE_API_ENDPOINT,
    STORAGE_API_ENDPOINT, PGSQL_API_ENDPOINT
    } = require('./common/config');
const staticGeneratorService = new kuruviProto.StaticGenerator(STATIC_GENERATOR_ENDPOINT, credentials);
const exifService = new kuruviProto.ExifApi(EXIF_API_ENDPOINT, credentials);
const faceService = new kuruviProto.FaceApi(FACE_API_ENDPOINT, credentials);
const resizeService = new kuruviProto.ResizeApi(RESIZE_API_ENDPOINT, credentials);
const storageService = new kuruviProto.StorageApi(STORAGE_API_ENDPOINT, credentials);
const pgsqlService = new kuruviProto.PgsqlApi(PGSQL_API_ENDPOINT, credentials);

/**
 * This is the final callback in executing photo-uploads to
 * photo-static-album creation process.
 * 
 * @param {*} err Error message while creating static web directory
 * @param {*} response Response on successful static web directory creation
 */
function endWorkFlowCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    // TODO: Send the url for the new static album page
    console.log('Executed workflow: ', response);
}

// /**
//  * After creating the exif folders,
//  * run the scanner and copy the folders and
//  * photos into appropriate static web folder's cache directory
//  * 
//  * @param {*} err Error message while creating exif based folders
//  * @param {*} response Response on successful exif folder creation.
//  */
// function exifFoldersGenCallback(err, response) {
//     if (err !== null) {
//         console.log(err);
//         return;
//     }
//     const albumInfo = response;
//     // Finally all the folders in album directory is scanned 
//     // and copied into the static web's cache directory
//     staticGeneratorService.createStaticWebDirectory(albumInfo, endWorkFlowCallback);
// }

/**
 * 
 * After the photos are completely uploaded, 
 * the photo-details extraction process
 * is started. This function
 * helps in executing the process by calling 
 * each service in some defined order.
 * @param {*} albumFolders Contains the name of album to be processed
 */
function startWorkFlow(albumUploadsFolder) {
    console.log('Given Album Info: ', albumUploadsFolder);

    // Photos are grouped under various tags using the exif details.
    // Copy the photos in given folder:photos directory structure.
    // staticGeneratorService.createExifFolders(albumUploadsFolder, exifFoldersGenCallback);
    const albumInfo = {name: albumUploadsFolder.albumName};
    staticGeneratorService.createStaticWebDirectory(albumInfo, endWorkFlowCallback);
}

function organizeData(albumUploadsFolder) {
    console.log("calling organize data")
    pgsqlService.organizeData(albumUploadsFolder, (err, res) => {
        console.log("organized data: ", res);
        startWorkFlow(albumUploadsFolder)
    })
}

function extractExif(albumUploadsFolder) {
    console.log("Inside extract exif details folder", albumUploadsFolder);
    exifService.exififyAlbum(albumUploadsFolder, (err, res) => {
        organizeData(albumUploadsFolder)
    });
}

function extractFaces(albumUploadsFolder) {
    faceService.cropAlbumFaces(albumUploadsFolder, (err, res) => {
        console.log("Detect faces Res: ", res);
        extractExif(albumUploadsFolder)
    })
}

function resizePhotos(albumUploadsFolder) {
    resizeService.resizePhotos(albumUploadsFolder, (err, res) => {
        console.log("resize photos res: ", res);
        extractFaces(albumUploadsFolder);
    });
}

function saveFolderDetails(albumUploadsFolder) {
    storageService.saveFolderDetails(albumUploadsFolder, (err, res) => {
        console.log("saved to folder: ", res);
        // resizePhotos(albumUploadsFolder);
        extractExif(albumUploadsFolder)
    });
}

function initWorkFlow(call, callback) {
    callback(null, saveFolderDetails(call.request));
}

module.exports = {initWorkFlow}