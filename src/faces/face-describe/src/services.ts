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

function getFaceFilesPath(photoDetails) {
    const baseDir = path.resolve(__dirname, '../album-faces');
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
async function describeFaces(photoDetails) {
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
    describeFaces
}