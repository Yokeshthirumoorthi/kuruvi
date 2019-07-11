/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const PROTO_PATH = __dirname + '/proto/fileUploader.proto';
const NODE_DATABASE = 'node-database:50051';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const kuruvi_proto = grpc.loadPackageDefinition(packageDefinition).kuruvi;
const credentials = grpc.credentials.createInsecure();
const client = new kuruvi_proto.PhotoUploadService(NODE_DATABASE, credentials);
const exif = require('./exif');

/**
 * Implements the AddPhoto RPC method.
 */
async function extractExif(call, callback) {
  const ExifRequest = call.request;
  const getPhotoPathCallback = (err, response) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    const imagePath = response.imagePath;
    const exifJson = exif.runLamda(imagePath);
    const NoOPCallback = () => {};
    const InsertExifRequest = {
      photo_id: ExifRequest.photo_id,
      exif: exifJson,
    };
    console.log('Exif Response',InsertExifRequest);
    client.insertExif(InsertExifRequest, NoOPCallback);
    // const EmptyResponse = {};
    // callback(null, EmptyResponse);
  };
  client.getPhotoFullPath(ExifRequest,getPhotoPathCallback);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(kuruvi_proto.ExifService.service, {extractExif: extractExif});
  server.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());
  console.log('Starting Exif Server');
  server.start();
}

main();
