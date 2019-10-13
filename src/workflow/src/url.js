/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {CADDT_SERVER_ENDPOINT} = require('./common/config');
const signature = require('./signature');
const {
  RESIZE_CORE_ENDPOINT,
  CADDT_SERVER_ENDPOINT
} = require('./common/config');

const UPLOADS_VOL = 'album-uploads';
const RESIZED_VOL = 'album-resized';
const FACES_VOL = 'album-faces';

const uploadURL = (albumName, photoName) => `http://${CADDT_SERVER_ENDPOINT}/${UPLOADS_VOL}/${albumName}/uploads/${photoName}`;
const resizedURL = (albumName, photoName) => `http://${CADDT_SERVER_ENDPOINT}/${RESIZED_VOL}/${albumName}/${photoName}`;
const facesURL = (albumName, photoName) => `http://${CADDT_SERVER_ENDPOINT}/${FACES_VOL}/${albumName}/${photoName}`;

/**
 * Generate a signed imgproxy URL for resizing images.
 * The source image URL is a caddy URL.
 */
function getImgProxyPhotoResizeURL(caddyURL) {
    const signedUrlSegment = signature.getSignedImgURL(caddyURL);
    const URL = `http://${RESIZE_CORE_ENDPOINT}${signedUrlSegment}`;
    return URL;
}

/**
 * Generate a signed imgproxy URL for cropping faces in photo.
 * The source image URL is a caddy URL.
 */
function getImgProxyCropFaceURL(caddyURL, boundingBox) {
  const signedUrlSegment = signature.getSignedImgCropURL(caddyURL, boundingBox);
  const URL = `http://${FACE_CROP_SERVER_ENDPOINT}${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a json for that contains all
 * the faces named along with the imgproxy url
 * used to crop that face out of the photo 
 */
function getImgProxyCropFaceURLList(caddyURL, boundingBoxes) {
   const getFaceURLs = (boundingBox) => {
      const name = shortid.generate();
      return {
        name: `face_${name}.jpg`,
        url: getImgProxyCropFaceURL(caddyURL, boundingBox) 
      }
   };
   const faceDetails= boundingBoxes.map(getFaceURLs);
   return faceDetails;
}

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function fsURL(albumName, photoName) {
  const URL =  `${RESIZED_VOL}/${albumName}/${photoName}`;
  return URL; 
}

module.exports = {
    uploadURL,
    resizedURL,
    facesURL,
    getImgProxyPhotoResizeURL,
    getImgProxyCropFaceURLList,
    fsURL
}