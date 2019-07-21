const pino = require('pino');
const { Client } = require('pg');
const {
    PGSQL_USERNAME,
    PGSQL_HOST,
    PGSQL_DATABASE_NAME,
    PGSQL_PASSWORD
} = require('../config')

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
//   const albumId = TODO: Implement uuid for id generation
    const albumName = data.name;
    const albumPath = data.path;
    const values = [albumName, albumPath];
    const query = `INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id`; 
    const albumId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${albumId} in album table`);
    return albumId;
}

/**
 * Inserts data into Photo table
 */
async function photoInsertRow(data) {
    // const photoId = TODO: Implement uuid for id generation
    const albumId = data.albumId;
    const photoName = data.name;
    const values = [albumId, photoName];
    const query = `INSERT INTO photos (album_id, name) VALUES ($1, $2) RETURNING id`; 
    const photoId = await insertRow(query, values);
    logger.info(`Successully inserted row# ${photoId} in photo table`);
    return photoId;
}

/**
 * Inserts data into exif table
 */
async function exifInsertRow(data) {
    // const exifId = TODO: Implement uuid for id generation
    const photoId = data.photoId;
    const make = data.make;
    const model = data.model;
    const createOn= data.createOn;
    const imageWidth= data.imageWidth;
    const imageHeight= data.imageHeight;
    const values = [photoId, make, model, createOn, imageWidth, imageHeight];
    const query = `INSERT INTO exif (photo_id, make, model, create_on, img_width, img_height) VALUES ($1, $2, $3, $4, $5) RETURNING id`; 
    const exifId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${exifId} in exif table`);
    return exifId;
}

/**
 * Inserts data into bounding_boxes table 
 */
async function boundingBoxInsertRow(data) {
    // const boundingBoxId = TODO: Implement uuid for id generation 
    const photoId = data.photoId;
    const x = data.x;
    const y = data.y;
    const width = data.width;
    const height = data.height;
    const values = [photoId, x, y, width, height];
    const query = `INSERT INTO bounding_boxes (photo_id, x, y, width, height) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const boundingBoxId = await insertRow(query, values);
    logger.info(`Successfully inserted row# ${boundingBoxId} into bounding_boxes table`);
    return boundingBoxId;
}

/**
 * Inserts data into face table
 */
async function faceInsertRow(data) {
    // const faceId = TODO: Implement uuid for id generation
    const photoId = data.photoId;
    const boundingBoxId = data.boundingBoxId;
    const fileName = data.fileName;
    const filePath = data.filePath;
    const values = [photoId, boundingBoxId, fileName, filePath];
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