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
const { Pool } = require('pg');
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

const client = new Pool({
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
    const query = `INSERT INTO exif (photo_id, make, model, create_on, width, height) VALUES ($1, $2, $3, $4, $5) RETURNING id`; 
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
    const query = `INSERT INTO faces (bounding_box_id, name) VALUES ($1, $2) RETURNING id`; 
    const faceId = await insertRow(query, values);
    logger.info(`Successully inserted row# ${faceId} in face table`);
    return faceId;
}

/**
 * Inserts data into face descriptors table
 */
async function faceDescriptorInsertRow(data) {
    const values = formatter.getFaceDescriptorRowValues(data);
    const query = `INSERT INTO face_descriptors (face_id, 
        p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11,
        p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22,
        p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33,
        p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44,
        p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55,
        p56, p57, p58, p59, p60, p61, p62, p63, p64, p65, p66,
        p67, p68, p69, p70, p71, p72, p73, p74, p75, p76, p77,
        p78, p79, p80, p81, p82, p83, p84, p85, p86, p87, p88,
        p89, p90, p91, p92, p93, p94, p95, p96, p97, p98, p99,
        p100, p101, p102, p103, p104, p105, p106, p107, p108, p109, p110,
        p111, p112, p113, p114, p115, p116, p117, p118, p119, p120, p121,
        p122, p123, p124, p125, p126, p127, p128) 
        VALUES ($1, 
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23,
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45,
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
            $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67,
            $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78,
            $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89,
            $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100,
            $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111,
            $112, $113, $114, $115, $116, $117, $118, $119, $120, $121, $122,
            $123, $124, $125, $126, $127, $128,
            $129) 
        RETURNING id`; 
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
async function getFaceDetails(bounding_box_id) {
    const query = 'SELECT * FROM faces WHERE bounding_box_id = $1';
    const values = [bounding_box_id];
    const res = await select(query, values);
    logger.info(`Success reading row# ${bounding_box_id} from faces table`);
    const face = res.rows[0];
    return face;
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
    const exifDetails = await getExifDetails(photoId);
    const boundingBoxesDetails = await getBoundingBoxesDetails(photoId);
    const facesDetails = await Promise.all(boundingBoxesDetails.map((boundingBox)=> getFaceDetails(boundingBox.id)));
    const photo = {
        photo: photoDetails,
        album: albumDetails,
        exif: exifDetails,
        boundingBoxes: boundingBoxesDetails,
        faces: facesDetails.filter(n => n) // Remove any undefined values inside array
    }
    // await client.end(); // FIXME: Unable to end the connection as it throws at runtime
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
    faceDescriptorInsertRow,
    getCompletePhotoDetails
}