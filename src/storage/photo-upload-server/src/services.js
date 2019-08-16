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

function savePhotoCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Saved photo with id: ', response.photo.id);
}

function savePhoto(savePhotoRequest) {
    const serviceX = new kuruviProto.ServiceX(SERVICE_X_ENDPOINT, credentials);
    serviceX.savePhoto(savePhotoRequest, savePhotoCallback);
}

function initWorkFlowCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Executed workflow: ', response);
}

function initWorkFlow(albumInfo) {
    const serviceX = new kuruviProto.ServiceX(SERVICE_X_ENDPOINT, credentials);
    serviceX.initWorkFlow(albumInfo, initWorkFlowCallback);
 
}

module.exports = {savePhoto, initWorkFlow}