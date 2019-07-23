/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const path = require('path');
const grpc = require('grpc');
const pino = require('pino');
const protoLoader = require('@grpc/proto-loader');
const pg = require('./postgres');
const {
  saveBoundingBoxes,
  getPhotoDetails,
  saveFaces
} = require('./src/rpc');

const {
  PGSQL_SERVICE_PORT,
  PGSQL_SERVICE_API_ENDPOINT} = require('./config');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
const credentials = grpc.ServerCredentials.createInsecure();
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const logger = pino({
  name: 'pgsql-service-server',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

/**
 * Helper function that loads a protobuf file.
 */
function _loadProto (path) {
  const packageDefinition = protoLoader.loadSync(
    path,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  );
  return grpc.loadPackageDefinition(packageDefinition);
}

/**
 * Implements the AddPhoto RPC method.
 */
async function addPhoto(call, callback) {
  logger.info(`Received Add photo Request...`);
  const photo_id = await pg.insertPhoto(call.request);
  const AddPhotoResponse = {
    photo_id:  photo_id,
  }
  callback(null, AddPhotoResponse);
}

/**
  * Implements the getBoundingBox RPC method.
 */
async function getBoundingBoxes(call, callback) {
  logger.info(`Calling get Bounding box ${call.request}`);
  const photo_id = call.request.photo_id;
  const bounding_boxes = await pg.getBoundingBoxes(photo_id);
  const path = await pg.getPhotoFullPath(photo_id);
  const GetBoundingBoxesResponse = {
    photo_id: photo_id,
    path: path,
    bounding_boxes: bounding_boxes,
  }; 
  callback(null, GetBoundingBoxesResponse);
}

/**
  * Implements the GetPhotoFullPath RPC method.
 */
async function getPhotoFullPath(call, callback) {
  logger.info(`Calling Photo path ${call.request}`);
  const imagePath = await pg.getPhotoFullPath(call.request.photo_id);
  const PathResponse = {
    imagePath:  imagePath,
  }
  callback(null, PathResponse);
}

/**
  * Implements the GetAlbumPhotoPath RPC method.
 */
async function getAlbumPhotoPath(call, callback) {
  logger.info(`Calling Album Photo path ${call.request}`);
  const AlbumPhotoPathResponse = await pg.getAlbumPhotoPath(call.request.photo_id);
  console.log("AlbumPhotoPathREsponse", AlbumPhotoPathResponse)
  callback(null, AlbumPhotoPathResponse);
}

/**
  * Implements the insertExif RPC method.
 */
async function insertExif(call, callback) {
  await pg.insertExif(call.request.photo_id, call.request.exif);
  const EmptyResponse = {};
  callback(null, EmptyResponse);
}

/**
  * Implements the insertBoundingBoxes RPC method.
 */
async function insertBoundingBoxes(call, callback) {
  logger.info(`Calling insert bounding box function`);
  await pg.insertBoundingBoxes(call.request.photo_id, call.request.bounding_boxes);
  const EmptyResponse = {};
  callback(null, EmptyResponse);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(kuruviProto.PhotoUploadService.service, {
    addPhoto: addPhoto,
    getPhotoFullPath: getPhotoFullPath,
    insertExif: insertExif,
    getAlbumPhotoPath: getAlbumPhotoPath,
    getBoundingBoxes: getBoundingBoxes,
    insertBoundingBoxes: insertBoundingBoxes,
    saveBoundingBoxes: saveBoundingBoxes,
    getPhotoDetails: getPhotoDetails,
    saveFaces: saveFaces
  });
  server.bind(PGSQL_SERVICE_API_ENDPOINT, credentials);
  logger.info(`Starting PgSQL Service on port ${PGSQL_SERVICE_PORT}`);
  server.start();
}

main();
