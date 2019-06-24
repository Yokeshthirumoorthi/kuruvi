#!/usr/bin/env node
// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const { getImageBuffer } = require('../../fs/imagereader');
const { generateEXIFJson } = require('./exifjs');
const rabbit = require('../../rabbitmq/receive');
// Project constants
// const IMG_DIRECTORY = './photos';

const runLamda = (imagePath) => {
  const imageBuffersWithPath = getImageBuffer(imagePath);
  const exifJsonArray = imageBuffersWithPath.map(generateEXIFJson);
  console.log(exifJsonArray);
};

rabbit.receiveMessage(runLamda);
