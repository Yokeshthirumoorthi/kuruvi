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

function startWorkFlow(albumInfo) {
    console.log('Given Album Info: ', albumInfo);
    const staticGeneratorService = new kuruviProto.StaticGenerator(STATIC_GENERATOR_ENDPOINT, credentials);
    staticGeneratorService.createStaticWebDirectory(albumInfo, startWorkFlowCallback);
}

function initWorkFlow(call, callback) {
    callback(null, startWorkFlow(call.request));
}
module.exports = {savePhoto, initWorkFlow}