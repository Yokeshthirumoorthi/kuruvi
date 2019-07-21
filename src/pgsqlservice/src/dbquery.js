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
 * Inserts data into Album table
 */
async function albumInsertRow(data) {
    await client.connect();
//   const albumId = TODO: Implement uuid for id generation
    const albumName = data.name;
    const albumPath = data.path;
    const values = [albumName, albumPath];
    const query = `INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id`; 
    const res = await client.query(query, values);
    await client.end();
    const albumId = res.rows[0].id;
    logger.info(`Successfully inserted row# ${albumId} in album table`);
    return albumId;
}

/**
 * Inserts data into Photo table
 */
async function photoInsertRow(data) {
    await client.connect();
    // const photoId = TODO: Implement uuid for id generation
    const albumId = data.albumId;
    const photoName = data.name;
    const values = [albumId, photoName];
    const query = `INSERT INTO photos (album_id, name) VALUES ($1, $2) RETURNING id`; 
    const res = await client.query(query, values);
    await client.end();
    const photoId = res.rows[0].id;
    logger.info(`Successfully inserted row# ${photoId} in photo table`);
    return photoId;
}

/**
 * Inserts data into exif table
 */
async function exifInsertRow(data) {
    await client.connect();
    // const exifId = TODO: Implement uuid for id generation
    const make = data.make;
    const model = data.model;
    const createOn= data.createOn;
    const imageWidth= data.imageWidth;
    const imageHeight= data.imageHeight;
    const values = [make, model, createOn, imageWidth, imageHeight];
    const query = `INSERT INTO exif (make, model, create_on, img_width, img_height) VALUES ($1, $2, $3, $4, $5) RETURNING id`; 
    const res = await client.query(query, values);
    await client.end();
    const exifId= res.rows[0].id;
    logger.info(`Successfully inserted row# ${exifId} in exif table`);
    return exifId;
}

module.exports = {
    albumInsertRow,
    photoInsertRow,
    exifInsertRow
}