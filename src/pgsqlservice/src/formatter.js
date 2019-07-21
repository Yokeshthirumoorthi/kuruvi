/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

/**
 * Provide the photo row values as an array to use in insert query
 */
function getAlbumRowValues(data) {
    //   const albumId = TODO: Implement uuid for id generation
    const albumName = data.name;
    const albumPath = data.path;
    const values = [albumName, albumPath];
    return values;
}

/**
 * Provide the exif row values as an array to use in insert query
 */
function getPhotoRowValues(data) {
    // const photoId = TODO: Implement uuid for id generation
    const albumId = data.albumId;
    const photoName = data.name;
    const values = [albumId, photoName];
    return values;
}

/**
 * Provide the exif row values as an array to use in insert query
 */
function getExifRowValues(data) {
    // const exifId = TODO: Implement uuid for id generation
    const photoId = data.photoId;
    const make = data.make;
    const model = data.model;
    const createOn= data.createOn;
    const width= data.width;
    const height= data.height;
    const values = [photoId, make, model, createOn, width, height];
    return values;
}

/**
 * Provide the bounding box row values as an array to use in insert query
 */
function getBoundingBoxRowValues(data) {
    // const boundingBoxId = TODO: Implement uuid for id generation 
    const photoId = data.photoId;
    const x = data.x;
    const y = data.y;
    const width = data.width;
    const height = data.height;
    const values = [photoId, x, y, width, height];
    return values;
}

/**
 * Provide the face row values as an array to use in insert query
 */
function getFaceRowValues(data) {
    // const faceId = TODO: Implement uuid for id generation
    const photoId = data.photoId;
    const boundingBoxId = data.boundingBoxId;
    const fileName = data.fileName;
    const filePath = data.filePath;
    const values = [photoId, boundingBoxId, fileName, filePath];
    return values;
}

module.exports = {
    getAlbumRowValues,
    getPhotoRowValues,
    getExifRowValues,
    getBoundingBoxRowValues,
    getFaceRowValues
}