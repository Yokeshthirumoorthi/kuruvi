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

function doExifBasedClassification(albumFolders) {
    console.log('Given Album folders req:', albumFolders);
}

function createExifFolders(call, callback) {
    callback(null, doExifBasedClassification(call.request));
}

async function createStaticDirectory(AlbumInfo) {
    console.log('Creating static web directory', AlbumInfo.name);
    await utils.generateStaticPage(AlbumInfo.name);
}

function createStaticWebDirectory(call, callback) {
    callback(null, createStaticDirectory(call.request));
}

module.exports = {createExifFolders, createStaticWebDirectory}