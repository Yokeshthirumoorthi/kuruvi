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
const fs = require('./saveFile');
// const rabbit = require('./rabbitmq');
// const pg = require('./postgres');
const signature = require('./signature');
const Axios = require('axios');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const DATABASE_PORT = 50051;
const NODE_DATABASE = `pgsqlservice:${DATABASE_PORT}`;
const IMGPROXY_PORT= 50053;
const IMGPROXY_IP= `0.0.0.0:${IMGPROXY_PORT}`;

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

/* ============================================================
  Function: Download Image
============================================================ */
async function downloadImage (imagePath) {
  const url = `http://caddy-fs:2015/${imagePath.album}/${imagePath.photo}`;
  console.log("caddy url: ", url);
  const signedUrlSegment = signature.getSignedImgURL(url);
  const signedUrl = `http://imgproxy:8080${signedUrlSegment}`;

  const response = await Axios({
    url: signedUrl,
    method: 'GET',
    responseType: 'stream'
  })

  return response;
}

// rabbit.receiveMessage((photo_id) => {
//   pg.getAlbumPhotoPath(photo_id).then(async (imagePath) => {
//     const download_response = await downloadImage(imagePath);
//     await fs.saveFile(imagePath, download_response);
//   })
// });

async function resizeImage(call, callback) {
  const ImgProxyRequest = call.request;
  logger.info(`Received img resize request for photo: ${ImgProxyRequest.photo_id}`);
  // get the photo_id from the Imgproxy request.
  // retrieve the album path from the database.
  // dwonload the photo in the path from the fs
  // resize and save the photo
  const getAlbumPhotoPathCallback = async (err, response) => {
    const AlbumPhotoPathResponse = response;
    console.log("AlbumPhotoPathResponse", AlbumPhotoPathResponse);
    const download_response = await downloadImage(AlbumPhotoPathResponse);
    await fs.saveFile(AlbumPhotoPathResponse, download_response);
  };

  const AlbumPhotoPathRequest = ImgProxyRequest;

  try {
    client.getAlbumPhotoPath(AlbumPhotoPathRequest,getAlbumPhotoPathCallback);
  } catch (err) {
    logger.error(`Album photo path request failed: ${err}`);
  }
}

/**
 * Starts an RPC server that receives requests for the exif service at the
 * server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruviProto.ImgProxyService.service, {resizeImage: resizeImage});
  server.bind(IMGPROXY_IP, grpc.ServerCredentials.createInsecure());
  logger.info(`Starting Imgproxy service on port ${IMGPROXY_PORT}`);
  server.start();
}

main();
