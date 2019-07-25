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

const MAIN_PROTO_PATH = path.join(__dirname, '../proto/fileUploader.proto');
const FACEAPI_PORT = 50054;
const FACEAPI_SERVICE = `172.20.0.4:${FACEAPI_PORT}`;

const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const faceapiService = new kuruviProto.FaceApiService(FACEAPI_SERVICE, credentials);

const logger = pino({
  name: 'faceapiservice-client',
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
 * 
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const photoDetailsRequest = {
    photoId: 203,
  };  
  logger.info(`Starting faceapi client`);
  // faceapiService.detectFaces(photoDetailsRequest, () => {});
  faceapiService.describeFaces(photoDetailsRequest, () => {});
}

main();
