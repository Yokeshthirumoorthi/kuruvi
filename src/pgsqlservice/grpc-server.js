/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
var PROTO_PATH = __dirname + '/proto/fileUploader.proto';

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

const pg = require('./postgres');

/**
 * Implements the AddPhoto RPC method.
 */
async function addPhoto(call, callback) {
  const photo_id = await pg.insertPhoto(call.request);
  const AddPhotoResponse = {
    photo_id:  photo_id,
  }
  callback(null, AddPhotoResponse);
}

/**
  * Implements the GetPhotoFullPath RPC method.
 */
async function getPhotoFullPath(call, callback) {
  console.log('Calling Photo path', call.request);
  const imagePath = await pg.getPhotoFullPath(call.request.photo_id);
  const PathResponse = {
    imagePath:  imagePath,
  }
  callback(null, PathResponse);
}

/**
  * Implements the insertExif RPC method.
 */
async function insertExif(call, callback) {
  await pg.insertExif(call.request.photo_id, call.request.exif);
  const EmptyResponse = {};
  callback(null, EmptyResponse);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(kuruvi_proto.PhotoUploadService.service, {
    addPhoto: addPhoto,
    getPhotoFullPath: getPhotoFullPath,
    insertExif: insertExif
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  console.log('Starting Database Server');
  server.start();
}

main();
