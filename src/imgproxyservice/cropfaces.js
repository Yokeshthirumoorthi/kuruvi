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
const fs = require('./saveFile');
const signature = require('./signature');
const Axios = require('axios');
require('dotenv').config();

const IMGPROXY_PORT= process.env.IMGPROXY_PORT;
const CADDY_PORT = process.env.CADDY_PORT;
const CADDY_SERVICE = process.env.CADDY_SERVICE;
const IMGPROXY_SERVICE = process.env.IMGPROXY_SERVICE;

const logger = pino({
  name: 'imgproxyservice-server',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(photoFSDetails) {
  const album = photoFSDetails.album;
  const photoPath = photoFSDetails.photo;
  const URL = `http://${CADDY_SERVICE}:${CADDY_PORT}/${album}/${photoPath}`;
  return URL; 
}

/**
 * Generate a signed imgproxy URL for cropping faces in photo.
 * The source image URL is a caddy URL.
 */
function getImgProxyCropFaceURL(caddyURL, boundingBox) {
  const signedUrlSegment = signature.getSignedImgCropURL(caddyURL, boundingBox);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}/${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a json for that contains all
 * the faces named along with the imgproxy url
 * used to crop that face out of the photo 
 */
function getImgProxyCropFaceURLList(caddyURL, boundingBoxes) {
   const getFaceURLs = (boundingBox, index) => {
      return {
        faceNumber: index,
        label: `face_${index}`,
        url: getImgProxyCropFaceURL(caddyURL, boundingBox) 
      }
   };
   const faceDetails= boundingBoxes.map(getFaceURLs);
   return faceDetails;
}

/**
 * Append face image to face details 
 */
function addFaceImage(faceDetail) {
  const url = faceDetail.url;
  const faceImage = getImage(url);
  return {...faceDetail, image: faceImage};
}

/**
 * Crop the faces from photo 
 */
async function getFaces(photoFSDetails, photoFaceDetails) {
  const caddyURL = getCaddyURL(photoFSDetails);
  const boundingBoxes = photoFaceDetails.boundingBoxes;
  const faceDetails = getImgProxyCropFaceURLList(caddyURL, boundingBoxes);
  const faceDetailsWithFaces = faceDetails.map((x) => addFaceImage(x));
  return faceDetailsWithFaces;
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
 * Get image from imgProxy
 */
async function getImage(imgProxyURL) {
  const image = await Axios({
    url: imgProxyURL,
    method: 'GET',
    responseType: 'stream'
  });

  return image; 
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