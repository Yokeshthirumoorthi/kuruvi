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
const protoLoader = require('@grpc/proto-loader');
const {
    PGSQL_SERVICE_API_ENDPOINT,
    IMGPROXY_SERVICE_API_ENDPOINT,
    EXIF_SERVICE_API_ENDPOINT,
    IMGUPLOAD_SERVICE_API_ENDPOINT,
    FACEAPI_SERVICE_API_ENDPOINT,
    IMGUPLOAD_SERVICE_PORT
} = require('./config');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/fileUploader.proto');

const kuruviProto = _loadProto(MAIN_PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const credentials = grpc.credentials.createInsecure();
const pgsqlService = new kuruviProto.PhotoUploadService(PGSQL_SERVICE_API_ENDPOINT, credentials);
// const exifService = new kuruviProto.ExifService(EXIF_SERVICE_API_ENDPOINT, credentials);
const imgProxyService = new kuruviProto.ImgProxyService(IMGPROXY_SERVICE_API_ENDPOINT, credentials);
const faceapiService = new kuruviProto.FaceApiService(FACEAPI_SERVICE_API_ENDPOINT, credentials);

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

const addPhotoCallback = (err, response) => {
  logger.info('New photo added: ', response);
  if (err !== null) {
    console.log(err);
    return;
  }
  const photo_id = response.photo_id;

  // const ImgProxyRequest = {
  //   photo_id: photo_id
  // };
  // imgProxyService.ResizeImage(ImgProxyRequest, () => {});
  const request = {
    photoId: photo_id
  };
  
  faceapiService.DetectFaces(request, () => {});
};

async function savePhotoToDatabase(AddPhotoRequest) {
    pgsqlService.AddPhoto(AddPhotoRequest,addPhotoCallback);
};

module.exports = {savePhotoToDatabase }