/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

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
async function cropAndSaveFaces(photoDetails) {
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
    return newPhotoDetails;
}

/**
 * gRPC server method implementation for cropping faces in photo 
 */
async function cropFaces(call, callback) {
    const result = await cropAndSaveFaces(call.request);
    callback(null, result);
}


module.exports = { cropFaces }