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

async function doExifBasedClassification(albumFolders) {
    console.log('Given Album folders req:', albumFolders);
    await utils.createExifFolders(albumFolders);
    const albumInfo = {
        name: albumFolders.albums[0].albumName
    }
    return albumInfo;
}

async function createExifFolders(call, callback) {
    callback(null, await doExifBasedClassification(call.request));
}

async function createStaticDirectory(AlbumInfo) {
    console.log('Creating static web directory', AlbumInfo.name);
    await utils.generateStaticPage(AlbumInfo.name);
}

async function createStaticWebDirectory(call, callback) {
    callback(null, await createStaticDirectory(call.request));
}

module.exports = {createExifFolders, createStaticWebDirectory}