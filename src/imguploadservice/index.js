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
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const makeDir = require('make-dir');
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

const logger = pino({
  name: 'imguploadservice-server',
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

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

/* Use cors and fileUpload*/
app.use(cors());
app.use(fileUpload());

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

function _getAddPhotoRequest(req) {
  const albumName = "album1";
  const folderName =`${__dirname}/uploads/${albumName}`;
  const fileName = `${req.body.filename}`;

  const AddPhotoRequest = {
    album: albumName,
    path: folderName,
    filename: fileName
  };

  return AddPhotoRequest
};

async function _saveImage(imageFile, AddPhotoRequest) {
  const path = await makeDir(AddPhotoRequest.path);
  const filePath = `${path}/${AddPhotoRequest.filename}`;

  imageFile.mv(filePath, function(err) {
    if (err) {
      logger.error(`Image upload request failed: ${err}`);
    }
    pgsqlService.AddPhoto(AddPhotoRequest,addPhotoCallback);
  });
  return;
}

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const imageFile = req.files.file;
  const AddPhotoRequest = _getAddPhotoRequest(req);

  _saveImage(imageFile, AddPhotoRequest);
  res.json({file: `public/${AddPhotoRequest.filename}.jpg`});
});

app.listen(IMGUPLOAD_SERVICE_PORT, () => logger.info(`Starting Image uploading service server on port ${IMGUPLOAD_SERVICE_PORT}`));
