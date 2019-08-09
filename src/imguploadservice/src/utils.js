/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
var shell = require('shelljs');
const makeDir = require('make-dir');

function runStaticGenerator() {
  // Running external tool synchronously
  if (shell.exec('PhotoFloat/scanner/main.py uploads cache').code !== 0) {
    shell.echo('Error: Photo scanner failed');
    shell.exit(1);
  }
}

function getAddPhotoRequest(albumName, fileName) {
  const folderName =`${__dirname}/uploads/${albumName}`;

  const AddPhotoRequest = {
    album: albumName,
    path: folderName,
    filename: fileName
  };

  return AddPhotoRequest
};

function createAlbumDirectory(path) {
    return  makeDir(path);
}

module.exports = {runStaticGenerator, getAddPhotoRequest, createAlbumDirectory}