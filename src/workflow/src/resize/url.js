const signature = require('./signature');
const {
  RESIZE_CORE_ENDPOINT,
  CADDT_SERVER_ENDPOINT
} = require('../common/config');

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(photoFSDetails) {
  const album = photoFSDetails.albumName;
  const photoPath = photoFSDetails.photoName;
  const URL =  `http://${CADDT_SERVER_ENDPOINT}/album-uploads/${album}/uploads/${photoPath}`;
  return URL; 
}

/**
 * Generate a signed imgproxy URL for resizing images.
 * The source image URL is a caddy URL.
 */
function getImgProxyPhotoResizeURL(caddyURL) {
  const signedUrlSegment = signature.getSignedImgURL(caddyURL);
  const URL = `http://${RESIZE_CORE_ENDPOINT}${signedUrlSegment}`;
  return URL;
}

module.exports = {
    getCaddyURL,
    getImgProxyPhotoResizeURL
}