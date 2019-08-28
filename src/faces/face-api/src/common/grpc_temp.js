/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

// DISCLAIMER: DONT update this file.
// This is an intermediate file used to 
// refactor code from fileuploader.proto to 
// kuruvi.proto.

const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const PROTO_PATH = path.join(__dirname, '../../proto/fileUploader.proto');

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
const fileUploader_credentials = grpc.credentials.createInsecure();
const serverCredentials = grpc.ServerCredentials.createInsecure();
// The protoDescriptor object has the full package hierarchy
const fileUploaderProto = _loadProto(PROTO_PATH).kuruvi;
// const healthProto = _loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

module.exports = {fileUploaderProto, fileUploader_credentials, serverCredentials}