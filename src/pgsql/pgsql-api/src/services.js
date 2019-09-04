/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const dgraph = require('./dgraph');
const pgsql = require('./pgsql');

async function organizeAlbum(message, sendAckToQueue) {
    console.log("Inside organize album", message);
    const albumName = message.albumName;
    const albumDetails = await dgraph.getAlbumDetails(albumName);
    console.log(albumDetails);
    await pgsql.insertAlbumDetails(albumDetails);
    const psqlTag1Photos = await pgsql.getPhotos(albumName);
    const tagName = 'tag1';
    const tag1Photots = psqlTag1Photos.map(photo => photo.name);
    await dgraph.addTagNode(tagName, albumDetails.uid, tag1Photots);
    sendAckToQueue();
}

module.exports = {organizeAlbum}