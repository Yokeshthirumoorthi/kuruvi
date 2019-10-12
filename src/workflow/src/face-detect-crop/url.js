const signature = require('./signature');
const {
  RESIZE_CORE_ENDPOINT,
  CADDT_SERVER_ENDPOINT
} = require('../common/config');
const shortid = require('shortid');

const FACE_CROP_SERVER_ENDPOINT = RESIZE_CORE_ENDPOINT;

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(photoFSDetails) {
  const album = photoFSDetails.album;
  const photoPath = photoFSDetails.photo;
  const URL =  `http://${CADDT_SERVER_ENDPOINT}/album-uploads/${album}/uploads/${photoPath}`;
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
        name: `face_${name}.png`,
        url: getImgProxyCropFaceURL(caddyURL, boundingBox) 
      }
   };
   const faceDetails= boundingBoxes.map(getFaceURLs);
   return faceDetails;
}

module.exports = {
    getCaddyURL,
    getImgProxyCropFaceURLList
}