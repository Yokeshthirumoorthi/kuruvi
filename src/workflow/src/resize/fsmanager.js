/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const fs = require('fs');
const path = require('path');
const Axios = require('axios');

function createFolderIfNotExits(path) {
  if (!fs.existsSync(path, { recursive: true })) {
    fs.mkdirSync(path, { recursive: true })
  }
}

function getAlbumPath(photoFSDetails, folderName) {
  const album = photoFSDetails.albumName;
  const albumPath = path.join(folderName, album);

  createFolderIfNotExits(albumPath);

  return albumPath;
}

async function saveResizedPhoto (photoFSDetails, response, folderName) {
  const albumPath = getAlbumPath(photoFSDetails, folderName);
  const fileName = photoFSDetails.photoName;
  const imagePath = path.resolve(albumPath, fileName);
  console.log("Image path",imagePath);
  const writer = fs.createWriteStream(imagePath)

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

/**
 * Get image from imgProxy
 */
async function getImage(imgProxyURL) {
  const image = await Axios({
    url: imgProxyURL,
    method: 'GET',
    responseType: 'stream'
  });

  return image; 
}

module.exports = {saveResizedPhoto, getImage}
