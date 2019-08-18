const signature = require('./signature');
const {
  // IMGPROXY_PORT,
  // IMGPROXY_SERVICE,
  CADDY_PORT,
  CADDY_SERVICE
} = require('../config');

const IMGPROXY_PORT = 8080;
const IMGPROXY_SERVICE = 'imgproxy';

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(photoFSDetails) {
  const album = photoFSDetails.album;
  const photoPath = photoFSDetails.photo;
  const URL =  `http://${CADDY_SERVICE}:${CADDY_PORT}/album-uploads/${album}/uploads/${photoPath}`;
  return URL; 
}

/**
 * Generate a signed imgproxy URL for resizing images.
 * The source image URL is a caddy URL.
 */
function getImgProxyPhotoResizeURL(caddyURL) {
  const signedUrlSegment = signature.getSignedImgURL(caddyURL);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a signed imgproxy URL for cropping faces in photo.
 * The source image URL is a caddy URL.
 */
function getImgProxyCropFaceURL(caddyURL, boundingBox) {
  const signedUrlSegment = signature.getSignedImgCropURL(caddyURL, boundingBox);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a json for that contains all
 * the faces named along with the imgproxy url
 * used to crop that face out of the photo 
 */
function getImgProxyCropFaceURLList(caddyURL, boundingBoxes) {
   const getFaceURLs = (boundingBox) => {
      return {
        boundingBoxId: boundingBox.id,
        name: `face_${boundingBox.id}.png`,
        url: getImgProxyCropFaceURL(caddyURL, boundingBox) 
      }
   };
   const faceDetails= boundingBoxes.map(getFaceURLs);
   return faceDetails;
}

module.exports = {
    getCaddyURL,
    getImgProxyPhotoResizeURL,
    getImgProxyCropFaceURLList
}