/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const shell = require('./shell');
const albumfs = require('./albumfs');

/**
 * Creates a folder in the name of album.
 * This folder has the html that is servered as static page.
 * 
 * The following steps are required to create the static page.
 * 1. create a folder in name of album
 * 2. create a subfolder as cache.
 * 3. copy the static html and its js.
 * 4. scan the uploaded album and create photos json 
 * and resized photos into the cache folder.
 * 5. Caddy can now server this folder as static page.
 * @param {*} albumName 
 */
async function generateStaticPage(albumName) {
    const {albumPath, cachePath} = await albumfs.getPaths(albumName);
    shell.execCopyStaticJS(albumPath);
    const {facePath} = await albumfs.getFacesFolderPath(albumName);
    shell.execCopyFaces(albumName, facePath);
    shell.execScanner(albumName, cachePath);
}

function createExifFolders(albumFolders) {
    albumFolders.albums.map(async albumFolder => {
        const {albumName, tagName, photos} = albumFolder;
        const paths = await albumfs.getExifTagFolderPaths(albumName, tagName);
        const src = paths.albumPath;
        const dest = paths.tagPath;
        shell.execExifFolderCreation(src, dest, photos);
    });
}

module.exports = {generateStaticPage, createExifFolders}