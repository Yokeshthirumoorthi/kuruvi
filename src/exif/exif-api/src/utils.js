/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const _ = require('lodash');
const { CADDY_PORT, CADDY_SERVICE } = require('./common/config');

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(albumName, photoName) {
  const URL =  `http://${CADDY_SERVICE}:${CADDY_PORT}/album-uploads/${albumName}/uploads/${photoName}`;
  return URL; 
}

/**
 * 
 * Transforms the exififyalbumrequest to a list 
 * of remote urls
 * @param {*} exififyAlbumRequest 
 */
function getRemoteURLList(exififyAlbumRequest) {
  const albumName = exififyAlbumRequest.albumName;
  const URLList = exififyAlbumRequest.photos.map(
    photoName => getCaddyURL(albumName, photoName)
  );
  return URLList;
}

// Given a raw exif json, reduce it to required-keys json
const parseEXIF = (rawEXIF, parsebyKeys) => {
  const tags = _.get(rawEXIF, 'tags');
  const result = _.pick(tags, parsebyKeys);
  return result;
};

module.exports = {parseEXIF, getRemoteURLList}