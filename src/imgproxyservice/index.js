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
const RPC = require('./src/rpc');
const {resizeImageAndSave} = require('./src/resize');
const {
  PGSQL_SERVICE_API_ENDPOINT,
  IMGPROXY_SERVICE_PORT,
  IMGPROXY_SERVICE_API_ENDPOINT,
  FACEAPI_SERVICE_API_ENDPOINT
} = require('./config');


const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsqlservice= new kuruviProto.PhotoUploadService(PGSQL_SERVICE_API_ENDPOINT, credentials);
const faceApiService= new kuruviProto.FaceApiService(FACEAPI_SERVICE_API_ENDPOINT, credentials);

const logger = pino({
  name: 'imgproxyservice-server',
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
 * gRPC function implementation 
 * get the photo_id from the Imgproxy request.
 * Retrieve the album path from the database. 
 * Download the photo in the path from fs, resize it and save it.
 */
function resizeImage(call, callback) { // TODO: Implement callback functionality
  const photoId = call.request.photo_id; // TODO: change photo_id as photoId
  logger.info(`Received img resize request for photo: ${photo_id}`);
  const photoFSDetailsRequest = { photo_id: photoId };
  pgsql.getAlbumPhotoPath(photoFSDetailsRequest, (err, response) => {
    if (err != null) {
      logger.error("Error in PhotoFSDetails call");
    }
    const photoFSDetails = response;
    resizeImageAndSave(photoFSDetails);
  });
}

/**
 * gRPC client for finding and saving face descriptions 
 */
async function describeFaces(photoDetailsRequest) {
  faceApiService.describeFaces(photoDetailsRequest, () => {});
}

/**
 * gRPC client for saving face details in database 
 */
async function saveFaces(photoDetailsRequest, photoDetails) {
  pgsqlservice.saveFaces(photoDetails, (err, res) => {
    logger.info(`Saved faces #'s ${res}`);
    describeFaces(photoDetailsRequest);
  })
}

/**
 * gRPC client for pgsqlService to getPhotoDetails using a photoId 
 */
async function getPhotoDetails(photoDetailsRequest, callback) {
  pgsqlservice.getPhotoDetails(photoDetailsRequest, (err, res) => {
     callback(res);
  })
}

/**
 * gRPC server method implementation for cropping faces in photo 
 */
async function cropFaces(call, callback) {
  const photoDetailsRequest = call.request;
  const photoId = photoDetailsRequest.photoId;
  logger.info(`Received crop face request for photo# ${photoId}`);

  getPhotoDetails(photoDetailsRequest, async (photoDetails) => {
      const photoDetailsWithFaceInfo = await RPC.cropAndSaveFaces(photoDetails);
      saveFaces(photoDetailsRequest, photoDetailsWithFaceInfo);
  });
}

/**
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruviProto.ImgProxyService.service, {resizeImage: resizeImage, cropFaces: cropFaces});
  server.bind(IMGPROXY_SERVICE_API_ENDPOINT, grpc.ServerCredentials.createInsecure());
  logger.info(`Starting Imgproxy service on port ${IMGPROXY_SERVICE_PORT}`);
  server.start();
}

main();