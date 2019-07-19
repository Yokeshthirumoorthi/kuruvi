/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const pino = require('pino');
const fs = require('./fsmanager');
const URL = require('./url');

const logger = pino({
  name: 'imgproxyservice-cropfaces',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

/**
 * Append face image to face details 
 */
function addFaceImage(faceDetail) {
  const url = faceDetail.url;
  const faceImage = fs.getImage(url);
  return {...faceDetail, image: faceImage};
}

/**
 * Save faces to disk
 */
async function saveFaces(photoFSDetails, faces) {
  faces.map(face => {
    const faceLabel = face.label;
    const image = face.image;
    fs.saveFile(photoFSDetails, image);  // TODO: fix the file path for saving faces
  })
}

/**
 * Crop the faces from photo 
 */
async function getFaces(photoFSDetails, photoFaceDetails) {
  const caddyURL = URL.getCaddyURL(photoFSDetails);
  const boundingBoxes = photoFaceDetails.bounding_boxes;
  const faceDetails = URL.getImgProxyCropFaceURLList(caddyURL, boundingBoxes);
  const faceDetailsWithFaces = faceDetails.map((x) => addFaceImage(x));
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
  // TODO: update db with face details
}

module.exports = {cropFacesAndSave}