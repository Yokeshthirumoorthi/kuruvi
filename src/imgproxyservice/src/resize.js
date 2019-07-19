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
  const URL =  `http://${CADDY_SERVICE}:${CADDY_PORT}/${album}/${photoPath}`;
  return URL; 
}

/**
 * Generate a signed imgproxy URL for resizing images.
 * The source image URL is a caddy URL.
 */
function getImgProxyPhotoResizeURL(caddyURL) {
  const signedUrlSegment = signature.getSignedImgURL(caddyURL);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}/${signedUrlSegment}`;
  return URL;
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
 * Save the image downloaded from imgproxy  
 */
async function saveImage(photoFSDetails, image) {
  return fs.saveFile(photoFSDetails, image);
}

/**
 * Given photo file system details,
 * fetch the photo from caddy server 
 * and resize it using imgproxy
 */
async function getResizedImage(photoFSDetails) {
   const caddyURL = getCaddyURL(photoFSDetails);
   const imgProxyURL = getImgProxyPhotoResizeURL(caddyURL);
   const resizedImage = getImage(imgProxyURL);
   return resizedImage;
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function resizeImageAndSave(photoFSDetails) {
  const resizedPhoto = await getResizedImage(photoFSDetails);
  await saveImage(photoFSDetails, resizedPhoto);
  logger.info(`Successfully resized and saved photo @ ${photoFSDetails.photo}`);
}

module.exports = {resizeImageAndSave}