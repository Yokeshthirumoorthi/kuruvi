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
const {CADDT_SERVER_ENDPOINT} = require('./common/config');

const VOLUME_NAME = 'album-uploads';
/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(albumName, photoName) {
  const URL =  `http://${CADDT_SERVER_ENDPOINT}/${VOLUME_NAME}/${albumName}/uploads/${photoName}`;
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
  const photos = exififyAlbumRequest.photos;
  const URLList = photos.map(
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