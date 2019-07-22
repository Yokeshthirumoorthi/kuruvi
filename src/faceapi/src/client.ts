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
// import * as faceDetection from './faceDetection';
// import { faceDetectionOptions } from './commons';

const MAIN_PROTO_PATH = path.join(__dirname, '../proto/fileUploader.proto');
const DATABASE_PORT = 50051;
const NODE_DATABASE = `192.168.160.4:${DATABASE_PORT}`;
// const IMGPROXY_PORT = 50053;
// const IMGPROXY_SERVICE = `imgproxyservice:${IMGPROXY_PORT}`;
const FACEAPI_PORT = 50054;
const FACEAPI_SERVICE = `0.0.0.0:${FACEAPI_PORT}`;

const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsqlservice = new kuruviProto.PhotoUploadService(NODE_DATABASE, credentials);
// const imgProxyService = new kuruviProto.ImgProxyService(IMGPROXY_SERVICE, credentials);
// const faceapiService = new kuruviProto.FaceApiService(FACEAPI_SERVICE, credentials);

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
// function main() {
//   const DetectFaceRequest = {
//     photo_id: 1,
//   };  
//   logger.info(`Starting faceapi client`);
//   faceapiService.detectFaces(DetectFaceRequest, () => {});
// }

// main();

function getPhotoDetails() {
    const photoDetailsRequest = {
      photoId: 1
    };
    logger.info('Getting photo details');
    pgsqlservice.getPhotoDetails(photoDetailsRequest, (err, res) => {
      console.log(res)
    });
}

getPhotoDetails();