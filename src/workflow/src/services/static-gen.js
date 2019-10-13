const fs = require('../utils/fsmanager');
const http = require('../utils/http');
const {FRONTEND_ENDPOINT} = require('../common/config');

function createFaceContent(message) {
    const albumName = message.albumName;
    fs.createFaceMDFile(albumName);
}

function createAlbumContent(message) {
    const {albumName, photoName} = message;
    fs.createAlbumMDFile(albumName, photoName);
}

function buildHugo() {
    const url = `http://${FRONTEND_ENDPOINT}/buildhugo`;
    http.buildHugo(url);
}

module.exports = {
    createFaceContent,
    createAlbumContent,
    buildHugo
}