/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const { FACE_DETECT_ENDPOINT } = require('./common/config');
const {kuruviProto, credentials} = require('./common/grpc');
const utils = require('./utils');

async function detectFacesCallback(err, response, message, sendAckToQueue) {
    if (err !== null) {
        console.log(err);
        sendAckToQueue();
        return;
    }
    console.log("Inside detect faces callback: ", response, message)
    // const photoName = message.photoName;
    // const albumUID = await dgraph.getAlbumUID(message.albumName);
    // await dgraph.addPhoto(photoName, albumUID);
    // const photoUID = await dgraph.getPhotoUID(photoName);
    // console.log("Photo UID: ", photoUID);
    // await dgraph.addExif(response, photoUID);
    sendAckToQueue();
}


function detectFaces(message, sendAckToQueue) {
    const faceCore= new kuruviProto.FaceCore(FACE_DETECT_ENDPOINT, credentials);
    const {albumName, photoName} = message;
    const caddyURL = utils.getCaddyURL(albumName, photoName);
    console.log("remote urls are : ", caddyURL);
    const photoURL = {
        url: caddyURL
    }
    faceCore.detectFaces(photoURL,
        (err, response) => detectFacesCallback(err, response, message, sendAckToQueue));
}

module.exports = {detectFaces}