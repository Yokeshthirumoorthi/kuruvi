/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const makeDir = require('make-dir');

const BASE_DIR = 'album-static-gen';// TODO: get this base dir from dotenv
const CACHE_DIR = 'cache';

/**
 * Creates albumPath and cache subfolder path dir path for albums
 * @param {*} albumName 
 */
async function getPaths(albumName) {
  const albumPath = `${BASE_DIR}/${albumName}`;
  const cachePath = `${albumPath}/${CACHE_DIR}`;
  // Make directories for album if not exist
  await createStaticFolder(albumName);
  return {
    albumPath,
    cachePath
  };
}

/**
 * Make directories for album if not exist
 * @param {*} albumName 
 */
async function createStaticFolder(albumName) {
    const {albumPath, cachePath} = getFolderStructure(albumName);
    await makeDir(albumPath);
    await makeDir(cachePath);
}

module.exports = {getPaths}