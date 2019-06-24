// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const _ = require('lodash');
const exif = require('exif-parser');
const fs = require('../fs/imagereader');
const rabbit = require('../rabbitmq/receive');

// Given an imagebuffer, extract exif out of it
const getEXIF = (imageBuffer) => {
  const parser = exif.create(imageBuffer);
  const result = parser.parse();
  return result;
};

// Given a raw exif json, reduce it to required-keys json
const parseEXIF = (rawEXIF) => {
  const tags = _.get(rawEXIF, 'tags');
  const parsebyKeys = ['Make', 'Model', 'CreateDate', 'ExifImageWidth', 'ExifImageHeight'];
  const result = _.pick(tags, parsebyKeys);
  return result;
};

// Given a path, generate apropriate exif json
const generateEXIFJson = (imageBufferWithPath) => {
  const {buffer, path} = imageBufferWithPath;

  var rawEXIF;
  try {
     rawEXIF = getEXIF(buffer);
  } catch (error) {
    showError(error, path)
  }

  const parsedEXIF = parseEXIF(rawEXIF);
  const result = {...parsedEXIF, path};
  return result;
};

const showError = (error, path) => {
  console.log("************************");
  console.log("ERROR MESSAGE: ", error);
  console.log("ERROR PATH: ", path);
  console.log("************************");
};

const runLamda = (imagePath) => {
  const imageBuffersWithPath = fs.getImageBuffer(imagePath);
  const exifJsonArray = generateEXIFJson(imageBuffersWithPath);
  console.log(exifJsonArray);
};

rabbit.receiveMessage(runLamda);
