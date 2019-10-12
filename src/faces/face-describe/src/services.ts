/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

import * as faceRecognition from './faceRecognition';
import * as path from 'path';

// function getFaceFilesPath(photoDetails) {
//     const baseDir = 'album-faces';
//     const albumName = photoDetails.albumName;
//     const faces = photoDetails.faces;
//     const newFaceObjects = faces.map(face => {
//         const fileName = face.name;
//         const filePath = path.resolve(baseDir, albumName, fileName);
//         // return {faceId: face.id, path: filePath};
//         return {...face, path: filePath};
//     });
//     return newFaceObjects;
// }

// /**
//  * Implements the get face descriptions rpc method 
//  */ 
// async function getDescriptorPoints(photoDetails) {
//     const faceFilesPath = getFaceFilesPath(photoDetails);
//     const faceDescriptors = await Promise.all(faceFilesPath.map(async (faceFile) => {
//         const result = await faceRecognition.describe(faceFile.path);
//         console.log("Facefile: ", faceFile)
//         console.log("Descriptor: ", JSON.stringify(result))
//         const descriptor = Array.from(result[0].descriptor);
//         return {...faceFile, descriptor};
//     }));
//     const photoDetailsWithFaceDescriptions = {...photoDetails, faceDescriptors};
//     return photoDetailsWithFaceDescriptions;
// }

function getFaceFilePath(photoDetails) {
    const baseDir = 'album-faces';
    const albumName = photoDetails.albumName;
    const fileName = photoDetails.photoName;
    const filePath = path.resolve(baseDir, albumName, fileName);
    return filePath;
}

async function getDescriptor(photoDetails) {
    const faceFilesPath = getFaceFilePath(photoDetails);
    const result = await faceRecognition.describe(faceFilesPath);
    const descriptor = Array.from(result[0].descriptor);
    return {points: descriptor}
}

/**
 * gRPC server method implementaion for detecting faces in a photo 
 */
async function describeFaces(call, callback) {
    const boundingBoxes = await getDescriptor(call.request);
    callback(null, boundingBoxes);
}

export {
    describeFaces
}