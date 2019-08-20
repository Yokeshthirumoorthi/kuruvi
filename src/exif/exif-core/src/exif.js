// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const _ = require('lodash');
const exif = require('exif-parser');
// const fs = require('fs');
const pino = require('pino');

const logger = pino({
  name: 'currencyservice-client',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

// Given an imagebuffer, extract exif out of it
const getEXIF = (imageBuffer) => {
  const parser = exif.create(imageBuffer);
  const result = parser.parse();
  return result;
};

// Given a raw exif json, reduce it to required-keys json
const parseEXIF = (rawEXIF, parsebyKeys) => {
  const tags = _.get(rawEXIF, 'tags');
  const result = _.pick(tags, parsebyKeys);
  return result;
};

// // Given a path, generate apropriate exif json
// const generateEXIFJson = (imageBufferWithPath) => {
//   const {buffer, path} = imageBufferWithPath;

//   var rawEXIF;
//   try {
//      rawEXIF = getEXIF(buffer);
//   } catch (error) {
//     logger.error(`Error in Exif: ${error} | @ path: ${path}`);
//   }

//   const parsedEXIF = parseEXIF(rawEXIF);
//   const result = {...parsedEXIF, path};
//   return result;
// };

// const getImageBuffer = (path) => {
//   const buffer = fs.readFileSync(path);
//   const result = {buffer, path};
//   return result;
// }

// const runLamda = (imagePath) => {
//   const imageBuffersWithPath = getImageBuffer(imagePath);
//   const exifJson = generateEXIFJson(imageBuffersWithPath);
//   return exifJson;
// };


/**
 * 
 * Extracts exif and filter only required values
 * @param {*} buffer image buffer downloaded from remote url or file system
 */
const extract = (buffer) => {
  var rawEXIF;
  try {
    rawEXIF = getEXIF(buffer);
    const parsebyKeys = ['Make', 'Model', 'CreateDate', 'ExifImageWidth', 'ExifImageHeight'];
    const parsedEXIF = parseEXIF(rawEXIF, parsebyKeys); 
    return parsedEXIF;
  } catch (error) {
    logger.error(`Error in Exif extraction : ${error}`);
  }
  return {};
}

module.exports = {extract}
