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
 * Implements the get bounding box rpc method 
 */ 
async function getBoundingBoxes(photoDetails) {
    const albumPath = photoDetails.album.path;
    const photoName = photoDetails.photo.name;
    const photoPath = `${albumPath}/${photoName}`;
    const boundingBoxes = await faceDetection.run(photoPath);
    const photoDetailsWithBoundingBoxes = {...photoDetails, boundingBoxes};
    return photoDetailsWithBoundingBoxes;
}

export {
    getBoundingBoxes,
}