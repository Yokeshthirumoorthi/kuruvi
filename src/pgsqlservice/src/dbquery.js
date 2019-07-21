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

/**
 * Execute the insert query for the given row values
 */
async function insertRow(insertQuery, values) {
    await client.connect();
    const res = await client.query(insertQuery, values);
    await client.end();
    const id = res.rows[0].id;
    return id;
}

/**
 * Inserts data into Album table
 */
async function albumInsertRow(data) {
    const values = formatter.getAlbumRowValues(data);
    const query = `INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id`; 
    const albumId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${albumId} in album table`);
    return albumId;
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

module.exports = {
    albumInsertRow,
    photoInsertRow,
    exifInsertRow,
    boundingBoxInsertRow,
    faceInsertRow
}