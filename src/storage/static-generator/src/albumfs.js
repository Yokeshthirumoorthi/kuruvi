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

const BASE_DIR = 'album-uploads'; // TODO: get this from dotenv
const STATIC_BASE_DIR = 'album-static-gen';// TODO: get this base dir from dotenv
const CACHE_DIR = 'cache';

function getAlbumPath(base_dir, albumName) {
  const albumPath = `${base_dir}/${albumName}`;
  return albumPath;
}

function getAlbumSubPath(albumPath, subFolderName) {
  const subFolderPath = `${albumPath}/${subFolderName}`;
  return subFolderPath;
}

/**
 * Creates albumPath and cache subfolder path dir path for albums
 * @param {*} albumName 
 */
async function getPaths(albumName) {
  const albumPath = getAlbumPath(STATIC_BASE_DIR, albumName);
  const cachePath = getAlbumSubPath(albumPath, CACHE_DIR);
  const paths = {albumPath, cachePath};
  // Make directories for album if not exist
  await createStaticFolder(paths);
  return paths;
}

/**
 * Make directories for album if not exist
 * @param {*} albumName 
 */
async function createStaticFolder(paths) {
    const {albumPath, cachePath} = paths;
    await makeDir(albumPath);
    await makeDir(cachePath);
}

async function getExifTagFolderPaths(albumName, tagName) {
  const albumPath = getAlbumPath(BASE_DIR, albumName);
  const tagPath = getAlbumSubPath(albumPath, tagName);
  await makeDir(tagPath);
  return {
    albumPath,
    tagPath
  }
}

async function getFacesFolderPath(albumName) {
  const albumPath = getAlbumPath(BASE_DIR, albumName);
  const facePath = getAlbumSubPath(albumPath, 'faces');
  await makeDir(facePath);
  return {
    facePath
  } 
}

async function getResizedFolderPath(albumName) {
  const albumPath = getAlbumPath(BASE_DIR, albumName);
  const resizedPath = getAlbumSubPath(albumPath, 'resized');
  await makeDir(resizedPath);
  return {
    resizedPath
  }
}

module.exports = {getPaths, getExifTagFolderPaths, getFacesFolderPath, getResizedFolderPath}