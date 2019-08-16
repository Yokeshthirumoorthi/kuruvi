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
const {STATIC_GENERATOR_ENDPOINT} = require('./common/config');

const staticGeneratorService = new kuruviProto.StaticGenerator(STATIC_GENERATOR_ENDPOINT, credentials);

function doSavePhoto(savePhotoReq) {
    console.log('Given Photo req:', savePhotoReq);
}

function savePhoto(call, callback) {
    callback(null, doSavePhoto(call.request));
}

function startWorkFlowCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Executed workflow: ', response);
}

function exifFoldersCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    const albumInfo = response;
    // Finally all the folders in album directory is scanned 
    // and copied into the static web's cache directory
    staticGeneratorService.createStaticWebDirectory(albumInfo, startWorkFlowCallback);
}

function startWorkFlow(albumInfo) {
    console.log('Given Album Info: ', albumInfo);

    // This is temp data used for dev
    const albumFolders = {albums: [
        {albumName: 'amy', tagName: 'tag1', photos: ['amy1.png', 'amy5.png']},
        {albumName: 'amy', tagName: 'tag2', photos: ['amy1.png', 'amy2.png']}
    ]}

    // Photos are grouped under various tags using the exif details.
    // Copy the photos in given folder:photos directory structure.
    staticGeneratorService.createExifFolders(albumFolders, exifFoldersCallback);
}

function initWorkFlow(call, callback) {
    callback(null, startWorkFlow(call.request));
}
module.exports = {savePhoto, initWorkFlow}