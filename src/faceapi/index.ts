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
import * as faceDetection from './faceDetection';

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
 
const DATABASE_PORT = 50051;
const PGSQL_SERVICE = `pgsqlservice:${DATABASE_PORT}`;

const IMGPROXY_PORT = 50053;
const IMGPROXY_SERVICE = `imgproxyservice:${IMGPROXY_PORT}`;

const FACEAPI_PORT = 50054;
const FACEAPI_SERVICE = `0.0.0.0:${FACEAPI_PORT}`;

const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsqlservice = new kuruviProto.PhotoUploadService(PGSQL_SERVICE, credentials);
const imgProxyService = new kuruviProto.ImgProxyService(IMGPROXY_SERVICE, credentials);

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

const getBoundingBox = (detection) => {
  const box = detection._box;
  return {
    x: box._x,
    y: box._y,
    width: box._width,
    height: box._height
  };
}

function _getInsertBoundingBoxesRequestObj(photo_id, detections) {
  const bounding_boxes = detections.map(getBoundingBox);
  const InsertBoundingBoxesRequest  = {
    photo_id: photo_id,
    bounding_boxes: bounding_boxes,
  };
  return InsertBoundingBoxesRequest;
}

/**
 *  Implements the face detection RPC method.
 */
async function detectFaces(call, callback) {
  const FaceDetectRequest = call.request;
  logger.info(`Received Face detect request`);

  const saveFaces = (err, response) => {
    const EmptyCallback = () => {};
    // imgProxyService.cropFaces(FaceDetectRequest, EmptyCallback);
    console.log("Preparing to call crop faces service");
  }

  const getPhotoPathCallback = async (err, response) => {
    const imagePath = response.imagePath;
    const photo_id = FaceDetectRequest.photo_id;
    // get list of bounding boxes detected in the image
    const boundingboxes = await faceDetection.run(imagePath);
    // generate a grpc request message
    const InsertBoundingBoxesRequest = _getInsertBoundingBoxesRequestObj(photo_id, boundingboxes);
    console.log(InsertBoundingBoxesRequest);
    // insert the bounding boxes into db using gRPC call
    pgsqlservice.insertBoundingBoxes(InsertBoundingBoxesRequest, saveFaces);
  };

  try {
    pgsqlservice.getPhotoFullPath(FaceDetectRequest,getPhotoPathCallback);
  } catch (err) {
    logger.error(`Face detection request failed: ${err}`);
  }

}

/**
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruviProto.FaceApiService.service, {detectFaces: detectFaces});
  server.bind(FACEAPI_SERVICE, grpc.ServerCredentials.createInsecure());
  logger.info(`Starting faceapi Server on port ${FACEAPI_PORT}`);
  server.start();
}

main();
