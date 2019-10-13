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

function createFolderIfNotExits(path) {
  if (!fs.existsSync(path, { recursive: true })) {
    fs.mkdirSync(path, { recursive: true })
  }
}

function getAlbumPath(photoFSDetails, folderName) {
  const albumName = photoFSDetails.albumName;
  const albumPath = path.join(folderName, albumName);

  createFolderIfNotExits(albumPath);

  return albumPath;
}

async function saveFace (photoFSDetails, face, folderName) {
  const albumPath = getAlbumPath(photoFSDetails, folderName);
  const fileName = face.name;
  const imagePath = path.resolve(albumPath, fileName);
  const writer = fs.createWriteStream(imagePath)

  face.image.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function saveResizedPhoto(photoFSDetails, response, folderName) {
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

function createMDFile(filePath, albumName) {
  createFolderIfNotExits(filePath);
  const file = `${filePath}/index.md`
  const content = 
`---
title: "${albumName}"
date: "${new Date()}"
description: "/pics/family/coverimage.jpg"
---`;
  fs.writeFileSync(file, content); 
}

async function createFaceMDFile(albumName, photoName) {
  const filePath = `album-faces/${albumName}`;
  createMDFile(filePath, albumName) 
}

async function createAlbumMDFile(albumName, photoName) {
  const filePath = `galleries/${albumName}`;
  const file = `${filePath}/index.md`
  const content = `\n
  {{< photo href="/pics/${albumName}/${photoName}" largeDim="1600x1600" smallUrl="/pics/${albumName}/${photoName}" smallDim="800x800" alt="None" thumbSize="256x256" thumbUrl="/pics/${albumName}/${photoName}" caption="" copyright="" >}}
  `;
  fs.exists(file, function (exists) {
    if(!exists)
    {
      createMDFile(filePath, albumName);
    }
  });
  fs.appendFileSync(file, content); 
}

module.exports = {saveFace, saveResizedPhoto, createFaceMDFile, createAlbumMDFile}
