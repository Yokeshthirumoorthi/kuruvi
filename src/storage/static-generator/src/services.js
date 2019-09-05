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
const dgraph = require('./dgraph');

async function getExifFolders(albumName) {
    const albumDetails = await dgraph.queryData(albumName);

    console.log("Query album: ", albumDetails);
    
    const tagDetails = albumDetails.all[0].tag;

    const getFolderInfo = (tagDetail) => {
        const tagName = tagDetail.name;
        const photos = tagDetail.photos.map(photo=> photo.name);
        return {
            albumName, tagName, photos
        }
    };

    const albumTags = tagDetails.map(getFolderInfo);

    return albumTags;
}

async function createStaticDirectory(AlbumInfo) {
    console.log('Creating static web directory', AlbumInfo.albumName);
    const exifFolders = await getExifFolders(AlbumInfo.albumName);
    console.log("Organize folders: ", exifFolders);
    await utils.createExifFolders(exifFolders)
    await utils.generateStaticPage(AlbumInfo.albumName);
}

async function createStaticWebDirectory(call, callback) {
    callback(null, await createStaticDirectory(call.request));
}

module.exports = {createStaticWebDirectory}