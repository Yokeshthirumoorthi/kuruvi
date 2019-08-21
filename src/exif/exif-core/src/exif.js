// Copyright © 2019 Yokesh Thirumoorthi
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.

const _ = require('lodash');
const exif = require('exif-parser');

// Given an imagebuffer, extract exif out of it
const getEXIF = async (imageBuffer) => {
  const parser = await exif.create(imageBuffer);
  const result = parser.parse();
  return result;
};

// Given a raw exif json, reduce it to required-keys json
const parseEXIF = (rawEXIF, parsebyKeys) => {
  const tags = _.get(rawEXIF, 'tags');
  const result = _.pick(tags, parsebyKeys);
  return result;
};

/**
 * Convert to format required by grpc message
 * @param {*} parsedExif 
 */
const formatResult = (parsedExif) => {
  return {
    make: parsedExif.Make,
    model: parsedExif.Model,
    create_on: parsedExif.CreateDate,
    width: parsedExif.ExifImageWidth,
    height: parsedExif.ExifImageHeight
  }
}
/**
 * 
 * Extracts exif and filter only required values
 * @param {*} buffer image buffer downloaded from remote url or file system
 */
const extract = async (buffer) => {
  var rawEXIF;
  try {
    rawEXIF = await getEXIF(buffer);
    const parsebyKeys = ['Make', 'Model', 'CreateDate', 'ExifImageWidth', 'ExifImageHeight'];
    const parsedEXIF = parseEXIF(rawEXIF, parsebyKeys); 
    const formattedResult = formatResult(parsedEXIF);
    return formattedResult;
  } catch (error) {
    console.log(`Error in Exif extraction : ${error}`);
  }
  return {};
}

module.exports = {extract}
