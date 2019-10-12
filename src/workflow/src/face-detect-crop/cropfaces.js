/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const fs = require('./fsmanager');
const URL = require('./url');

/**
 * Append face image to face details 
 */
async function addFaceImage(faceDetail) {
  const url = faceDetail.url;
  const faceImage = await fs.getImage(url);
  const updatedFaceDetail = {...faceDetail, image: faceImage};
  return updatedFaceDetail;
}

/**
 * Save faces to disk
 */
async function saveFaces(photoFSDetails, faces) {
  faces.map(face => {
    fs.saveFace(photoFSDetails, face, 'faces');  // TODO: fix the file path for saving faces
  })
}

/**
 * Crop the faces from photo 
 */
async function getFaces(photoFSDetails, photoFaceDetails) {
  const caddyURL = URL.getCaddyURL(photoFSDetails);
  const boundingBoxes = photoFaceDetails.bounding_boxes;
  const faceDetails = URL.getImgProxyCropFaceURLList(caddyURL, boundingBoxes);
  const faceDetailsWithFaces = await Promise.all(faceDetails.map(addFaceImage));
  return faceDetailsWithFaces;
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function cropFacesAndSave(photoFSDetails, photoFaceDetails) {
  const faces = await getFaces(photoFSDetails, photoFaceDetails);
  await saveFaces(photoFSDetails, faces);
  logger.info(`Successfully cropped and saved faces @ ${photoFSDetails.photo}`);
  return faces;
}

module.exports = {cropFacesAndSave}