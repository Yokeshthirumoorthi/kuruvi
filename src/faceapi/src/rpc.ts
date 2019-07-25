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

export {
    getBoundingBoxes,
}