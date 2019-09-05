/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const database = require('./database');

async function savePhoto(savePhotoRequest, sendAckToQueue) {
    console.log("Inside save photo", savePhotoRequest);
    var albumUID;
    albumUID = await database.getAlbumUID(savePhotoRequest.albumName);
    console.log("AlbumUID: ", albumUID);
    if (albumUID === '') {
        await database.createAlbum(savePhotoRequest.albumName); 
        albumUID = await database.getAlbumUID(savePhotoRequest.albumName); 
    }
    await database.addPhoto(savePhotoRequest.photoName, albumUID);
    sendAckToQueue();
}

module.exports = {savePhoto}