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
const {cropFacesAndSave} = require('./src/cropfaces');
const {resizeImageAndSave} = require('./src/resize');
const {
  PGSQL_SERVICE_API_ENDPOINT,
  IMGPROXY_PORT,
  IMGPROXY_SERVICE_API_ENDPOINT
} = require('./config');


const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsql= new kuruviProto.PhotoUploadService(PGSQL_SERVICE_API_ENDPOINT, credentials);

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
 * gRPC function implementation 
 * get the photo_id from the Imgproxy request.
 * Retrieve the album path from the database. 
 * Download the photo in the path from fs, crop it and save it.
 */
function cropFaces(call, callback) { // TODO: Implement callback functionality
  const photoId = call.request.photo_id; // TODO: change photo_id as photoId
  logger.info(`Received img face crop request for photo: ${photo_id}`);
  const photoFSDetailsRequest = { photo_id: photoId };
  pgsql.getAlbumPhotoPath(photoFSDetailsRequest, (err, response) => {
      const photoFSDetails = response;
      const photoFaceDetails = call.request;
      cropFacesAndSave(photoFSDetails, photoFaceDetails);
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
  logger.info(`Starting Imgproxy service on port ${IMGPROXY_PORT}`);
  server.start();
}

main();

// async function hack() {
//   const AlbumPhotoPathResponse = {
//     album: 'album1',
//     photo: 'bbt1.jpg'
//   }
//   const download_response = await downloadImage(AlbumPhotoPathResponse);
//   await fs.saveFile(AlbumPhotoPathResponse, download_response);
// }

// hack();
