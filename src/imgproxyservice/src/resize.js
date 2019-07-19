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
  name: 'imgproxyservice-resize',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

/**
 * Given photo file system details,
 * fetch the photo from caddy server 
 * and resize it using imgproxy
 */
async function getResizedImage(photoFSDetails) {
   const caddyURL = URL.getCaddyURL(photoFSDetails);
   const imgProxyURL = URL.getImgProxyPhotoResizeURL(caddyURL);
   const resizedImage = fs.getImage(imgProxyURL);
   return resizedImage;
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function resizeImageAndSave(photoFSDetails) {
  const resizedPhoto = await getResizedImage(photoFSDetails);
  await fs.saveFile(photoFSDetails, resizedPhoto, "resized");
  logger.info(`Successfully resized and saved photo @ ${photoFSDetails.photo}`);
}

module.exports = {resizeImageAndSave}