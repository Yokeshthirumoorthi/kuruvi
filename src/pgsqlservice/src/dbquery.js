/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const pino = require('pino');
const { Client } = require('pg');
const {
    PGSQL_USERNAME,
    PGSQL_HOST,
    PGSQL_DATABASE_NAME,
    PGSQL_PASSWORD
} = require('../config');
const formatter = require('./formatter');

const logger = pino({
  name: 'pgsql-service-server',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

const client = new Client({
  user: PGSQL_USERNAME,
  host: PGSQL_HOST,
  database: PGSQL_DATABASE_NAME,
  password: PGSQL_PASSWORD,
  port: 5432,
});

async function establishDBConnection() {
    await client.connect();
}

async function closeDBConnection() {
    await client.end();
}

/**
 * Execute the insert query for the given row values
 */
async function insertRow(insertQuery, values) {
    const res = await client.query(insertQuery, values);
    const id = res.rows[0].id;
    return id;
}

/**
 * Execute select query 
 */
async function select(selectQuery, values) {
    const res = await client.query(selectQuery, values);
    return res;
}

/**
 * Inserts data into Album table
 */
async function albumInsertRow(data) {
    const values = formatter.getAlbumRowValues(data);
    const query = `INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id`; 
    const albumId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${albumId} in album table`);
    return alumId;
}

/**
 * Inserts data into Photo table
 */
async function photoInsertRow(data) {
    const values = formatter.getPhotoRowValues(data);
    const query = `INSERT INTO photos (album_id, name) VALUES ($1, $2) RETURNING id`; 
    const photoId = await insertRow(query, values);
    logger.info(`Successully inserted row# ${photoId} in photo table`);
    return photoId;
}

/**
 * Inserts data into exif table
 */
async function exifInsertRow(data) {
    const values = formatter.getExifRowValues(data);
    const query = `INSERT INTO exif (photo_id, make, model, create_on, img_width, img_height) VALUES ($1, $2, $3, $4, $5) RETURNING id`; 
    const exifId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${exifId} in exif table`);
    return exifId;
}

/**
 * Inserts data into bounding_boxes table 
 */
async function boundingBoxInsertRow(data) {
    const values = formatter.getBoundingBoxRowValues(data);
    const query = `INSERT INTO bounding_boxes (photo_id, x, y, width, height) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const boundingBoxId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${boundingBoxId} into bounding_boxes table`);
    return boundingBoxId;
}

/**
 * Inserts data into face table
 */
async function faceInsertRow(data) {
    const values = formatter.getFaceRowValues(data);
    const query = `INSERT INTO photos (photo_id, boundingBox_id, file_name, file_path) VALUES ($1, $2, $3, $4) RETURNING id`; 
    const faceId = await insertRow(query, values);
    logger.info(`Successully inserted row# ${faceId} in face table`);
    return faceId;
}

/**
 * Fetch and return details of photo 
 */
async function getPhotoDetails(photoId) {
    const values = [photoId];
    const query = 'SELECT * FROM photos WHERE id = $1';
    const res = await select(query, values);
    logger.info(`Success reading row# ${photoId} from photo table`)
    const photoRow = res.rows[0];
    return photoRow;
}

/**
 * Fetch and return details of an album
 */
async function getAlbumDetails(albumId) {
    const query = 'SELECT * FROM albums WHERE id = $1';
    const values = [albumId];
    const res = await select(query, values);
    logger.info(`Success reading row# ${albumId} from album table`);
    const albumRow= res.rows[0];
    return albumRow;
}

/**
 * Fetch and return exif details of a photo
 */
async function getExifDetails(photoId){
    const query = 'SELECT * FROM exif WHERE photo_id = $1';
    const values = [photoId];
    const res = await select(query, values);
    logger.info(`Success reading row# ${photoId} from exif table`);
    const exifRow = res.rows[0];
    return exifRow;
}

/**
 * Fetch and return bounding boxes in a photo
 */
async function getBoundingBoxesDetails(photoId) {
    const query = 'SELECT * FROM bounding_boxes WHERE photo_id = $1';
    const values = [photoId];
    const res = await select(query, values);
    logger.info(`Success reading row# ${photoId} from bounding boxes table`);
    const boundingBoxes = res.rows;
    return boundingBoxes;
}

/**
 * Fetch and return the details about faces in a photo
 */
async function getFacesDetails(photoId) {
    const query = 'SELECT * FROM faces WHERE photo_id = $1';
    const values = [photoId];
    const res = await select(query, values);
    logger.info(`Success reading row# ${photoId} from faces table`);
    const faces = res.rows;
    return faces;
}

/**
 * Get comprehensive details about a photo
 * TODO: Use appropriate join query
 */
async function getCompletePhotoDetails (photoId) {
    await client.connect();
    const photoDetails = await getPhotoDetails(photoId);
    const albumId = photoDetails.album_id;
    const albumDetails = await getAlbumDetails(albumId);
    // const exifDetails = await getExifDetails(photoId);
    const boundingBoxesDetails = await getBoundingBoxesDetails(photoId);
    // const facesDetails = await getFacesDetails(photoId);
    const photo = {
      id: photoId,
      album: albumDetails.name,
      albumPath: albumDetails.path,
      name: photoDetails.name,
    //   make: exifDetails.make,
    //   model: exifDetails.model,
    //   createOn: exifDetails.createOn,
    //   width: exifDetails.width,
    //   height: exifDetails.height,
      boundingBoxes: boundingBoxesDetails,
    //   faces: facesDetails
    }
    await client.end();
    return photo;
}

module.exports = {
    establishDBConnection,
    closeDBConnection,
    albumInsertRow,
    photoInsertRow,
    exifInsertRow,
    boundingBoxInsertRow,
    faceInsertRow,
    getCompletePhotoDetails
}