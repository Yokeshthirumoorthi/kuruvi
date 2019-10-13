const fs = require('../utils/fsmanager');

function createFaceContent(message) {
    const albumName = message.albumName;
    fs.createFaceMDFile(albumName);
}

function createAlbumContent(message) {
    const {albumName, photoName} = message;
    fs.createAlbumMDFile(albumName, photoName);
}

module.exports = {
    createFaceContent,
    createAlbumContent
}