/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

import * as faceDetection from './faceDetection';
import * as faceRecognition from './faceRecognition';
import * as path from 'path';

/**
 * Sanitize Face Detection object
 */
function sanitizeFaceDetectionObject(faceDetections) {
    const boxes = faceDetections.map(detection => detection._box);
    const boundingBoxes = boxes.map(box => {
        return {
            x: box._x,
            y: box._y,
            width: box._width,
            height: box._height
        }
    });
    return boundingBoxes;
}

/**
 * Implements the get bounding box rpc method 
 */ 
async function getBoundingBoxes(photoDetails) {
    const albumPath = photoDetails.album.path;
    const photoName = photoDetails.photo.name;
    const photoPath = `${albumPath}/${photoName}`;
    const faceDetections = await faceDetection.run(photoPath);
    const boundingBoxes = sanitizeFaceDetectionObject(faceDetections);
    const photoDetailsWithBoundingBoxes = {...photoDetails, boundingBoxes};
    return photoDetailsWithBoundingBoxes;
}

function getFaceFilesPath(photoDetails) {
    const baseDir = path.resolve(__dirname, '../faces');
    const albumName = photoDetails.album.name;
    const faces = photoDetails.faces;
    const newFaceObjects = faces.map(face => {
        const fileName = face.name;
        const filePath = path.resolve(baseDir, albumName, fileName);
        return {faceId: face.id, path: filePath};
    });
    return newFaceObjects;
}

/**
 * Implements the get face descriptions rpc method 
 */ 
async function getFaceDescriptions(photoDetails) {
    const faceFilesPath = getFaceFilesPath(photoDetails);
    const faceDescriptors = await Promise.all(faceFilesPath.map(async (faceFile) => {
        const result = await faceRecognition.describe(faceFile.path);
        const descriptor = Array.from(result[0].descriptor);
        return {...faceFile, descriptor};
    }));
    const photoDetailsWithFaceDescriptions = {...photoDetails, faceDescriptors};
    return photoDetailsWithFaceDescriptions;
}

export {
    getBoundingBoxes,
    getFaceDescriptions
}