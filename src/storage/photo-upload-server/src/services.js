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
const { SERVICE_X_ENDPOINT } = require('./common/config');
const database = require('./database');

function savePhotoCallback(err, response) {
    if (err !== null) {
        console.log("Error", err);
        return;
    }
    console.log('Saved photo with id: ', response.photo.id);
}

async function savePhoto(savePhotoRequest) {
    console.log("Inside save photo", savePhotoRequest);
    var albumUID;
    albumUID = await database.getAlbumUID(savePhotoRequest.albumName);
    console.log("AlbumUID: ", albumUID);
    if (albumUID === '') {
        await database.createAlbum(savePhotoRequest.albumName); 
        albumUID = await database.getAlbumUID(savePhotoRequest.albumName); 
    }
    await database.addPhoto(savePhotoRequest.photoName, albumUID);
    // const serviceX = new kuruviProto.ServiceX(SERVICE_X_ENDPOINT, credentials);
    // serviceX.savePhoto(savePhotoRequest, savePhotoCallback);
}

function initWorkFlowCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Executed workflow: ', response);
}

function initWorkFlow(initWorkFlowRequest) {
    const serviceX = new kuruviProto.ServiceX(SERVICE_X_ENDPOINT, credentials);
    serviceX.initWorkFlow(initWorkFlowRequest, initWorkFlowCallback);
 
}

module.exports = {savePhoto, initWorkFlow}