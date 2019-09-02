/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

// const { FACE_DETECT_ENDPOINT, FACE_CROP_ENDPOINT } = require('./common/config');
// const {kuruviProto, credentials} = require('./common/grpc');
// const utils = require('./utils');

// function cropFacesCallback(err, response, sendAckToQueue) {
//     console.log("Inside cropFacesCallback", err, response);
//     sendAckToQueue();
// }

// function cropFaces(cropFacesRequest, sendAckToQueue) {
//     const faceCore= new kuruviProto.FaceCrop(FACE_CROP_ENDPOINT, credentials);
//     faceCore.cropFaces(cropFacesRequest, 
//         (err, response) => cropFacesCallback(err, response, sendAckToQueue))
// }

// function detectFacesCallback(err, response, message, sendAckToQueue) {
//     if (err !== null) {
//         console.log(err);
//         sendAckToQueue();
//         return;
//     }
//     console.log("Inside detect faces callback: ", response, message)
//     // const photoName = message.photoName;
//     // const albumUID = await dgraph.getAlbumUID(message.albumName);
//     // await dgraph.addPhoto(photoName, albumUID);
//     // const photoUID = await dgraph.getPhotoUID(photoName);
//     // console.log("Photo UID: ", photoUID);
//     // await dgraph.addExif(response, photoUID);
//     const cropFacesRequest = {
//         ...message,
//         boundingBoxes: response.boxes
//     }
//     cropFaces(cropFacesRequest, sendAckToQueue);
// }


// function detectFaces(message, sendAckToQueue) {
//     const faceCore= new kuruviProto.FaceCore(FACE_DETECT_ENDPOINT, credentials);
//     const {albumName, photoName} = message;
//     const fsURL = utils.fsURL(albumName, photoName);
//     console.log("fs url  : ", fsURL);
//     const photoURL = {
//         url: fsURL
//     }
//     faceCore.detectFaces(photoURL,
//         (err, response) => detectFacesCallback(err, response, message, sendAckToQueue));
// }

// module.exports = {detectFaces}


const database = require('./database');

async function savePhoto(savePhotoRequest, sendAckToQueue) {
    console.log("Inside save photo", savePhotoRequest);
    var albumUID;
    albumUID = await database.getAlbumUID(savePhotoRequest.albumName);
    console.log("AlbumUID: ", albumUID);
    if (albumUID === '') {
        await database.createAlbum(savePhotoRequest.albumName); 
        albumUID = await database.getAlbumUID(savePhotoRequest.albumName); 
    }
    await database.addPhoto(savePhotoRequest.photoName, albumUID);
    sendAckToQueue();
}

module.exports = {savePhoto}