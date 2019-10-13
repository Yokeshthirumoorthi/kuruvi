/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const fs = require('../utils/fsmanager');
const URL = require('../utils/url');
const http = require('../utils/http');

/**
 * Given photo file system details,
 * fetch the photo from caddy server 
 * and resize it using imgproxy
 */
async function getResizedImage(photoFSDetails) {
   const {albumName, photoName} = photoFSDetails;
   const caddyURL = URL.uploadURL(albumName, photoName);
   const imgProxyURL = URL.getImgProxyPhotoResizeURL(caddyURL);
   const resizedImage = await http.getImage(imgProxyURL);
   return resizedImage;
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function resizeImageAndSave(photoFSDetails, nextJob) {
  const resizedPhoto = await getResizedImage(photoFSDetails);
  await fs.saveResizedPhoto(photoFSDetails, resizedPhoto, "album-resized");
  console.log(`Successfully resized and saved photo @ ${photoFSDetails.photo}`);
  nextJob()
}

module.exports = {resizeImageAndSave}