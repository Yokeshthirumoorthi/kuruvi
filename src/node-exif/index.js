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
const exif = require('./exif');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const DATABASE_PORT = 50051;
const NODE_DATABASE = `node-database:${DATABASE_PORT}`;
const EXIF_PORT = 50052;
const NODE_EXIF = `0.0.0.0:${EXIF_PORT}`;

const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const client = new kuruviProto.PhotoUploadService(NODE_DATABASE, credentials);

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

function _getExif (pathResponse) {
  const imagePath = pathResponse.imagePath;
  const exifJson = exif.runLamda(imagePath);
  return exifJson;
}

function _getInsertExifRequestObj (ExifRequest, exif) {
  const photo_id = ExifRequest.photo_id;
  const InsertExifRequest = {
    photo_id: photo_id,
    exif: exif,
  };
  return InsertExifRequest;
}

/**
 *  Implements the exif extraction RPC method.
 *
 *  Get the Path of the given photo id by querying the database,
 *  then use the path to run exif lamda.
 *  Finally insert the result into data base.
 */
async function extractExif(call, callback) {
  const ExifRequest = call.request;
  logger.info(`Received Exif Extraction Request... ${ExifRequest}`);

  const insertExif = (InsertExifRequest) => {
    const EmptyCallback = () => {};
    client.insertExif(InsertExifRequest, EmptyCallback);
  }

  const getPhotoPathCallback = (err, response) => {
    // get the exif data extracted out of the image
    const exifJson = _getExif(response);
    // generate a grpc request message
    const InsertExifRequest = _getInsertExifRequestObj(ExifRequest, exifJson);
    // insert exif into db using gRPC call
    insertExif(InsertExifRequest);
  };

  try {
    client.getPhotoFullPath(ExifRequest,getPhotoPathCallback);
  } catch (err) {
    logger.error(`Exif extraction request failed: ${err}`);
  }

}

/**
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruviProto.ExifService.service, {extractExif: extractExif});
  server.bind(NODE_EXIF, grpc.ServerCredentials.createInsecure());
  logger.info(`Starting Exif Server on port ${EXIF_PORT}`);
  server.start();
}

main();
