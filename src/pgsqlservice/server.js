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

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');

const PGSQLSERVICE_PORT= 50051;
const PGSQLSERVICE_IP= `0.0.0.0:${PGSQLSERVICE_PORT}`;
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
const credentials = grpc.ServerCredentials.createInsecure();
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const logger = pino({
  name: 'currencyservice-server',
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
  * Implements the insertExif RPC method.
 */
async function insertExif(call, callback) {
  await pg.insertExif(call.request.photo_id, call.request.exif);
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
    insertExif: insertExif
  });
  server.bind(PGSQLSERVICE_IP, credentials);
  logger.info(`Starting PgSQL Service on port ${PGSQLSERVICE_PORT}`);
  server.start();
}

main();
