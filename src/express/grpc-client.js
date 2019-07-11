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

const addPhotoCallback = (err, response) => {
  console.log('New photo added: ', response);
  if (err !== null) {
    console.log(err);
    return;
  }
  return response.album_id;
};

function insertPhoto(AddPhotoRequest) {
  const client = new kuruvi_proto.PhotoUploadService(NODE_DATABASE, credentials);
  client.AddPhoto(AddPhotoRequest,addPhotoCallback);
}

module.exports = {insertPhoto}
