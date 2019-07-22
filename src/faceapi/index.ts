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
import * as faceDetection from './src/faceDetection';
import {
    PGSQL_SERVICE_API_ENDPOINT,
    IMGPROXY_SERVICE_API_ENDPOINT,
    FACEAPI_SERVICE_API_ENDPOINT,
    FACEAPI_SERVICE_PORT
} from './config';
import * as RPC from './src/rpc';

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsqlservice = new kuruviProto.PhotoUploadService(PGSQL_SERVICE_API_ENDPOINT, credentials);
const imgProxyService = new kuruviProto.ImgProxyService(IMGPROXY_SERVICE_API_ENDPOINT, credentials);

const logger = pino({
  name: 'faceapiservice-server',
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

async function saveBoundingBoxes(boundingBoxes) {
  pgsqlservice.saveBoundingBoxes(boundingBoxes, (err, res) => {
    logger.info(`Saved bounding boxes #'s ${res}`);
  })
}

async function getPhotoDetails(photoDetailsRequest, callback) {
  pgsqlservice.getPhotoDetails(photoDetailsRequest, (err, res) => {
     callback(res);
  })
}

async function detectFaces(call, callback) {
  const photoDetailsRequest = call.request;
  const photoId = photoDetailsRequest.photoId;
  logger.info(`Received face detection request for photo# ${photoId}`);

  getPhotoDetails(photoDetailsRequest, async (photoDetails) => {
    const boundnigBoxes = await RPC.getBoundingBoxes(photoDetails);
    saveBoundingBoxes(boundnigBoxes);
  });
}

/**
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruviProto.FaceApiService.service, {detectFaces: detectFaces});
  server.bind(FACEAPI_SERVICE_API_ENDPOINT, grpc.ServerCredentials.createInsecure());
  logger.info(`Starting faceapi Server on port ${FACEAPI_SERVICE_PORT}`);
  server.start();
}

main();
