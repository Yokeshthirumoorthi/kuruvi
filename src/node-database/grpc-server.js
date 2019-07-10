/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

const pg = require('./postgres');

/**
 * Implements the AddPhoto RPC method.
 */
async function addPhoto(call, callback) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("JASMINE101"), 1000)
  });
  let album_id = await pg.insertPhoto(call.request);
  const AddPhotoResponse = {
    album_id:  album_id,
  }
  callback(null, AddPhotoResponse);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(kuruvi_proto.PhotoUploadService.service, {addPhoto: addPhoto});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  console.log('Starting Server');
  server.start();
}

main();
