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

module.exports = {
    uploadURL,
    resizedURL,
    facesURL,
    getImgProxyPhotoResizeURL
}