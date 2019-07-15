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


function createFolderIfNotExits(fullPath) {
  if (!fs.existsSync(fullPath, { recursive: true })) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}

async function saveFile (imagePath, download_response) {
  createFolderIfNotExits(`${__dirname}/resized/${imagePath.album}`);
  const imgPath = path.resolve(__dirname, 'resized', imagePath.album, imagePath.photo);
  const writer = fs.createWriteStream(imgPath)

  download_response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = {saveFile}
