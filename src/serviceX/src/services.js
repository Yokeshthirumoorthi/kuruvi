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
const {STATIC_GENERATOR_ENDPOINT, PGSQL_SERVICE_API_ENDPOINT, 
    FACEAPI_SERVICE_API_ENDPOINT, EXIF_API_ENDPOINT,
    FACE_API_ENDPOINT, RESIZE_API_ENDPOINT,
    STORAGE_API_ENDPOINT
    } = require('./common/config');
const staticGeneratorService = new kuruviProto.StaticGenerator(STATIC_GENERATOR_ENDPOINT, credentials);
const exifService = new kuruviProto.ExifApi(EXIF_API_ENDPOINT, credentials);
const faceService = new kuruviProto.FaceApi(FACE_API_ENDPOINT, credentials);
const resizeService = new kuruviProto.ResizeApi(RESIZE_API_ENDPOINT, credentials);
const storageService = new kuruviProto.StorageApi(STORAGE_API_ENDPOINT, credentials);

// const {fileUploaderProto, fileUploader_credentials} = require('./common/grpc_temp');
// const photoUploadServiceService_fileUploader = new fileUploaderProto.PhotoUploadService(PGSQL_SERVICE_API_ENDPOINT, fileUploader_credentials);
// const detectFaces_fileUploader = new fileUploaderProto.FaceApiService(FACEAPI_SERVICE_API_ENDPOINT, fileUploader_credentials);


// /** TODO: Use this function until we completely
//  * get rid of fileUploader.proto
//  */
// function doSavePhoto_fileUploader(savePhotoReq) {
//     const request = {
//         album: savePhotoReq.albumName,
//         path: `/usr/src/app/album-uploads/${savePhotoReq.albumName}/uploads`,
//         filename: savePhotoReq.photoName
//     }
//     photoUploadServiceService_fileUploader.addPhoto(request, (err, res) => {
//         const detectFaceRequest = {
//             photoId : res.photo_id
//         };
//         console.log(detectFaceRequest);
//         // detectFaces_fileUploader.detectFaces(detectFaceRequest, (err, res) => {
//         //     console.log("Detect faces Res: ", res);
//         // })
//     })
// }

// /**
//  * 
//  * Persists the albumname and photoname in database.
//  * @param {*} savePhotoReq AlbumName and PhotoName are provided in this param
//  */
// function doSavePhoto(savePhotoReq) {
//     console.log('Given Photo req:', savePhotoReq);
//     doSavePhoto_fileUploader(savePhotoReq);
// }

// function savePhoto(call, callback) {
//     callback(null, doSavePhoto(call.request));
// }

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
 * After creating the exif folders,
 * run the scanner and copy the folders and
 * photos into appropriate static web folder's cache directory
 * 
 * @param {*} err Error message while creating exif based folders
 * @param {*} response Response on successful exif folder creation.
 */
function exifFoldersGenCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    const albumInfo = response;
    // Finally all the folders in album directory is scanned 
    // and copied into the static web's cache directory
    staticGeneratorService.createStaticWebDirectory(albumInfo, endWorkFlowCallback);
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
function startWorkFlow(err, response) {
    const albumFolders = response;
    console.log('Given Album Info: ', albumFolders);

    // This is temp data used for dev
    // const albumFolders = {albums: [
    //     {albumName: 'amy', tagName: 'tag1', photos: ['amy1.png', 'amy5.png']},
    //     {albumName: 'amy', tagName: 'tag2', photos: ['amy1.png', 'amy2.png']}
    // ]}
    // const albumFolders = {albums: [
    //     {albumName: 'album2', tagName: 'tag1', photos: ['bbt1.jpg', 'bbt2.jpg']},
    //     {albumName: 'album2', tagName: 'tag2', photos: ['bbt1.jpg', 'bbt4.jpg']}
    // ]}

    // Photos are grouped under various tags using the exif details.
    // Copy the photos in given folder:photos directory structure.
    staticGeneratorService.createExifFolders(albumFolders, exifFoldersGenCallback);
}

function extractExif(albumUploadsFolder) {
    console.log("Inside extract exif details folder", albumUploadsFolder);
    exifService.exififyAlbum(albumUploadsFolder, startWorkFlow);
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
        resizePhotos(albumUploadsFolder);
    });
}

function initWorkFlow(call, callback) {
    // callback(null, extractFaces(call.request));
    callback(null, saveFolderDetails(call.request));
}

module.exports = {initWorkFlow}