/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

// const VOLUME_NAME = 'album-uploads';
const VOLUME_NAME = 'album-resized';

/**
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function fsURL(albumName, photoName) {
  // const URL =  `${VOLUME_NAME}/${albumName}/uploads/${photoName}`;
  const URL =  `${VOLUME_NAME}/${albumName}/${photoName}`;
  return URL; 
}

module.exports = {fsURL}