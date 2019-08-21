/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const utils = require('./utils');
const exif = require('./exif');

/**
 * 
 * Downloads photo from given url and 
 * extracts exif data
 * @param {*} photoURL remote path from where photo could be downloaded
 */
async function doExifExtraction(photoURL) {
    const imageBuffer = await utils.getImage(photoURL.url);
    const data = await exif.extract(imageBuffer);
    console.log('Extracted Exif: ', data);
    return data;
}

async function extractExif(call, callback) {
    const responseMessage = await doExifExtraction(call.request)
    callback(null, responseMessage);
}

module.exports = {extractExif}
