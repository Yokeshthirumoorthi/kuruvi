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
const signature = require('./signature');
const Axios = require('axios');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');
const DATABASE_PORT = 50051;
const NODE_DATABASE = `pgsqlservice:${DATABASE_PORT}`;
const IMGPROXY_PORT= 50053;
const IMGPROXY_IP= `0.0.0.0:${IMGPROXY_PORT}`;
const CADDY_PORT = 2015; //TODO: Use environmental variable
const CADDY_SERVICE = `caddy-fs`; //TODO: Use environmental variable
const IMGPROXY_PORT = 8080; // TODO: Use environmental variable
const IMGPROXY_SERVICE = `imgproxy`; //TODO: Use environmental variable
const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const client = new kuruviProto.PhotoUploadService(NODE_DATABASE, credentials);

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
 * Generates a proper caddy url using the album name
 * and photo path.
 */
function getCaddyURL(photoFSDetails) {
  const album = photoFSDetails.album;
  const photoPath = photoFSDetails.photo;
  const URL =  `http://${CADDY_SERVICE}:${CADDY_PORT}/${album}/${photoPath}`;
  return URL; 
}

/**
 * Generate a signed imgproxy URL for resizing images.
 * The source image URL is a caddy URL.
 */
function getImgProxyPhotoResizeURL(caddyURL) {
  const signedUrlSegment = signature.getSignedImgURL(caddyURL);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}/${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a signed imgproxy URL for cropping faces in photo.
 * The source image URL is a caddy URL.
 */
function getImgProxyCropFaceURL(caddyURL, boundingBox) {
  const signedUrlSegment = signature.getSignedImgCropURL(caddyURL, boundingBox);
  const URL = `http://${IMGPROXY_SERVICE}:${IMGPROXY_PORT}/${signedUrlSegment}`;
  return URL;
}

/**
 * Generate a json for that contains all
 * the faces named along with the imgproxy url
 * used to crop that face out of the photo 
 */
function getImgProxyCropFaceURLList(caddyURL, boundingBoxes) {
   const getFaceURLs = (boundingBox, index) => {
      return {
        faceNumber: index,
        label: `face_${index}`,
        url: getImgProxyCropFaceURL(caddyURL, boundingBox) 
      }
   };
   const faceDetails= boundingBoxes.map(getFaceURLs);
   return faceDetails;
}

/**
 * Append face image to face details 
 */
function addFaceImage(faceDetail) {
  const url = faceDetail.url;
  const faceImage = getImage(url);
  return {...faceDetail, image: faceImage};
}

/**
 * Crop the faces from photo 
 */
async function getFaces(photoFSDetails, photoFaceDetails) {
  const caddyURL = getCaddyURL(photoFSDetails);
  const boundingBoxes = photoFaceDetails.boundingBoxes;
  const faceDetails = getImgProxyCropFaceURLList(caddyURL, boundingBoxes);
  const faceDetailsWithFaces = faceDetails.map(addFaceImage);
  return faceDetailsWithFaces;
}

/**
 * Save faces to disk
 */
async function saveFaces(photoFSDetails, faces) {
  faces.map(face => {
    const faceLabel = face.label;
    const image = face.image;
    fs.saveFile(photoFSDetails, image);  // TODO: fix the file path for saving faces
  })
}

/**
 * Get image from imgProxy
 */
async function getImage(imgProxyURL) {
  const image = await Axios({
    url: imgProxyURL,
    method: 'GET',
    responseType: 'stream'
  });

  return image; 
}

/**
 * Save the image downloaded from imgproxy  
 */
async function saveImage(photoFSDetails, image) {
  return fs.saveFile(photoFSDetails, image);
}

/**
 * Given photo file system details,
 * fetch the photo from caddy server 
 * and resize it using imgproxy
 */
async function getResizedImage(photoFSDetails) {
   const caddyURL = getCaddyURL(photoFSDetails);
   const imgProxyURL = getImgProxyPhotoResizeURL(caddyURL);
   const resizedImage = getImage(imgProxyURL);
   return resizedImage;
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function resizeImageAndSave(err, response) {
  if (err != null) {
    logger.error("Error in PhotoFSDetails call");
  }

  const photoFSDetails = response;
  const resizedPhoto = await getResizedImage(photoFSDetails);
  await saveImage(photoFSDetails, resizedPhoto);
  logger.info(`Successfully resized and saved photo @ ${photoFSDetails.photo}`);
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
  const photoFSDetailsRequest = {
    photo_id: photoId,
  };
  pgsql.getAlbumPhotoPath(photoFSDetailsRequest,resizeImageAndSave);
}

/**
 * Callback to be executed after getting photoFSDetails
 * from postgresql grpc call
 */
async function cropFacesAndSave(photoFSDetails, photoFaceDetails) {
  const faces = await getFaces(photoFSDetails, photoFaceDetails);
  await saveFaces(photoFSDetails, faces);
  logger.info(`Successfully cropped and saved faces @ ${photoFSDetails.photo}`);
  // TODO: update db with face details
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
  server.bind(IMGPROXY_IP, grpc.ServerCredentials.createInsecure());
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
