// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const path = require('path');
const fs = require('fs');

/** Retrieve file paths from a given folder and its subfolders. */
const getFilePaths = (folder) => {
  const imgPaths = fs.readdirSync(folder).map(img => path.join(folder, img));
  const filePaths = imgPaths.filter(imgPath => fs.statSync(imgPath).isFile());
  const dirPaths = imgPaths.filter(imgPath => !filePaths.includes(imgPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(getFilePaths(curr)), []);
  return [...filePaths, ...dirFiles];
};

// Check if given path is an image
const isImageFile = (path) => {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  const result = regex.test(path);
  return result;
};

const getImageBuffer = (path) => {
  const buffer = fs.readFileSync(path);
  const result = {buffer, path};
  return result;
}

const getImageBuffersInFolder = (folderName) => {
  const files = getFilePaths(folderName);
  const imgFiles = files.filter(isImageFile);
  const imageBuffersWithPath = imgFiles.map(getImageBuffer);
  return imageBuffersWithPath;
}

module.exports = {
  getImageBuffersInFolder
}
