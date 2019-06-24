#!/usr/bin/env node
// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const { getImageBuffersInFolder } = require('./imagereader');
const { generateEXIFJson } = require('./exifjs');
const rabbit = require('../../rabbitmq/receive');
// Project constants
// const IMG_DIRECTORY = './photos';

const runLamda = (albumName) => {
  const imageBuffersWithPath = getImageBuffersInFolder(albumName);
  const exifJsonArray = imageBuffersWithPath.map(generateEXIFJson);
  console.log(exifJsonArray);
};

rabbit.receiveMessage(runLamda);
