/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const { FACE_DETECT_ENDPOINT } = require('../common/config');
const {kuruviProto, credentials} = require('../common/grpc');
const utils = require('./utils');

const cropfaces = require('./cropfaces');

/**
 * Sanitize faces json to save in database 
 */
function sanitizeFacesJson(faces) {
   const newFacesJson = faces.map(face => {
       return {
           name: face.name,
           boundingBoxId: face.boundingBoxId,
       }
   });
   return newFacesJson; 
}

/**
 * Implements the sequence of steps 
 * for cropping and saving faces in a photo
 */
async function cropAndSaveFaces(photoDetails, nextJob) {
    const photoFSDetails = {
        album: photoDetails.albumName,
        photo: photoDetails.photoName
    };
    const photoFaceDetails = {
        bounding_boxes: photoDetails.boundingBoxes
    };
    const faces = await cropfaces.cropFacesAndSave(photoFSDetails, photoFaceDetails);
    const newFacesJson = sanitizeFacesJson(faces);
    const newPhotoDetails = {...photoDetails, faces: newFacesJson};
    console.log("Result", newPhotoDetails)
    // return newPhotoDetails;
    nextJob(newPhotoDetails)
}

// /**
//  * gRPC server method implementation for cropping faces in photo 
//  */
// async function cropFaces(call, callback) {
//     const result = await cropAndSaveFaces(call.request);
//     callback(null, result);
// }


function detectFacesCallback(err, response, message, nextJob) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log("Inside detect faces callback: ", response, message)
    // const photoName = message.photoName;
    // const albumUID = await dgraph.getAlbumUID(message.albumName);
    // await dgraph.addPhoto(photoName, albumUID);
    // const photoUID = await dgraph.getPhotoUID(photoName);
    // console.log("Photo UID: ", photoUID);
    // await dgraph.addExif(response, photoUID);
    const cropFacesRequest = {
        ...message,
        boundingBoxes: response.boxes
    }
    cropAndSaveFaces(cropFacesRequest, nextJob);
}


function detectAndCropFaces(message, nextJob) {
    const faceCore= new kuruviProto.FaceCore(FACE_DETECT_ENDPOINT, credentials);
    const {albumName, photoName} = message;
    const fsURL = utils.fsURL(albumName, photoName);
    console.log("fs url  : ", fsURL);
    const photoURL = {
        url: fsURL
    }
    faceCore.detectFaces(photoURL,
        (err, response) => detectFacesCallback(err, response, message, nextJob));
}


module.exports = { detectAndCropFaces }