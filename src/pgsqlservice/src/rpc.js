/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const dbquery = require('./dbquery');
const pino = require('pino');
const formatter = require('./formatter');

const logger = pino({
  name: 'pgsql-service-server',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

/**
 * Implements the saveBoundingBoxes RPC method
 */
async function saveBoundingBoxes(call, callback) {
  const photoDetails = call.request;
  const photoId = photoDetails.photo.id;
  const boundingBoxesRows = formatter.generateBoundingBoxesRows(photoDetails);
  logger.info(`Saving bounding boxes for photo #${photoId}`);
  try {
        await dbquery.establishDBConnection();
        const boundingBoxesIds = await Promise.all(boundingBoxesRows.map((row) => dbquery.boundingBoxInsertRow(row)));
    //   await dbquery.closeDBConnection(); // FIXME: Unable to close the connection
        const response = { id: boundingBoxesIds };
        callback(null, response);
  } catch (err) {
        logger.error(`Error saving bounding boxes for photo #${photoId} - ${err}`);    
        console.log(err);
        callback(err, []);
  }
}

/**
 * Implements the saveFaces RPC method
 */
async function saveFaces(call, callback) {
  const photoDetails = call.request;
  const photoId = photoDetails.photo.id;
  const facesRows = photoDetails.faces;
  console.log(call);
  logger.info(`Saving faces for photo #${photoId}`);
  try {
      await dbquery.establishDBConnection();
      const facesId = await Promise.all(facesRows.map((row) => dbquery.faceInsertRow(row)));
    //   await dbquery.closeDBConnection(); // FIXME: Unable to close the connection
      const response = { id: facesId};
      callback(null, response);
  } catch (err) {
      logger.error(`Error saving faces for photo #${photoId} - ${err}`);
      console.log(err);
      callback(err, []);
  }
}

/**
 * Implements the getPhotoDetails RPC method
 */
async function getPhotoDetails(call, callback) {
    const photoId = call.request.photoId;
    try {
        const photoDetails = await dbquery.getCompletePhotoDetails(photoId);
        callback(null, photoDetails);
    } catch (err) {
        logger.error(`Error fetching photo details for photoId ${photoId} - ${err}`);
        console.log(err);
        callback(err, {});
    }
}

module.exports = {
    saveBoundingBoxes,
    getPhotoDetails,
    saveFaces,
}