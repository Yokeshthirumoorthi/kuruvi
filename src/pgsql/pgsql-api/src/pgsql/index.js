/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const db = require('./dbClient');

async function insertAlbumDetails(albumDetails) {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const albumName = albumDetails.name;
    const photos = albumDetails.photos;
    try {
        await db.query('BEGIN')
        const queryText = 'INSERT INTO albums(name, path) VALUES($1, $2) RETURNING id'
        const albumsRes = await db.query(queryText, [albumName, ''])
        const albumId = albumsRes.rows[0].id;
        await Promise.all(photos.map(async photo => {
            const insertPhotoText = 'INSERT INTO photos(album_id, name) VALUES ($1, $2) RETURNING id'
            const insertPhotoValues = [albumId, photo.name];
            const photoRes = await db.query(insertPhotoText, insertPhotoValues);
            const photoId = photoRes.rows[0].id;
            console.log("photoID: ", photoId);
            await Promise.all(photos.map(async photo => {
                const insertExifText = 'INSERT INTO exif (photo_id, make, model, create_on, width, height) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
                const {make, model, createOn, width, height} = photo.exif;
                const insertExifValues = [photoId, make, model, createOn, width, height];
                await db.query(insertExifText, insertExifValues)
            })); 
        }));        
        await db.query('COMMIT')
    } catch (e) {
        await db.query('ROLLBACK')
        throw e
    } finally {
        // db.release()
    }
}

module.exports = {
    insertAlbumDetails
}