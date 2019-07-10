/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */


var PROTO_PATH = __dirname + '/../pb/fileUploader.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var kuruvi_proto = grpc.loadPackageDefinition(packageDefinition).kuruvi;

function insertPhoto(AddPhotoRequest) {
  var client = new kuruvi_proto.PhotoUploadService('node-database:50051',
                                       grpc.credentials.createInsecure());
  const addPhotoCallback = (err, response) => {
    console.log('New photo added: ', response);
  };
  client.AddPhoto(AddPhotoRequest,addPhotoCallback);
}

module.exports = {insertPhoto}
