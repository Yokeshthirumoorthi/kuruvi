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
    STORAGE_API_ENDPOINT, PGSQL_API_ENDPOINT,
    FACE_DESCRIBE_ENDPOINT
    } = require('./common/config');
const staticGeneratorService = new kuruviProto.StaticGenerator(STATIC_GENERATOR_ENDPOINT, credentials);
const exifService = new kuruviProto.ExifApi(EXIF_API_ENDPOINT, credentials);
const faceService = new kuruviProto.FaceApi(FACE_API_ENDPOINT, credentials);
const resizeService = new kuruviProto.ResizeApi(RESIZE_API_ENDPOINT, credentials);
const storageService = new kuruviProto.StorageApi(STORAGE_API_ENDPOINT, credentials);
const pgsqlService = new kuruviProto.PgsqlApi(PGSQL_API_ENDPOINT, credentials);
const faceDescribeService = new kuruviProto.FaceDescribe(FACE_DESCRIBE_ENDPOINT, credentials);

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
    staticGeneratorService.createStaticWebDirectory(albumUploadsFolder, endWorkFlowCallback);
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

function describeFaces(albumUploadsFolder) {
    faceDescribeService.describeFaces(albumUploadsFolder, (err, res) => {
        console.log("Describe faces Res: ", err, res);
    })
}

function extractFaces(albumUploadsFolder) {
    faceService.cropAlbumFaces(albumUploadsFolder, (err, res) => {
        console.log("Detect faces Res: ", res);
        describeFaces(albumUploadsFolder);
        // extractExif(albumUploadsFolder)
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
        resizePhotos(albumUploadsFolder);
        // describeFaces(albumUploadsFolder);
    });
}

function initWorkFlow(call, callback) {
    console.log("starting workflow: ", call.request);
    callback(null, saveFolderDetails(call.request));
}

module.exports = {initWorkFlow}