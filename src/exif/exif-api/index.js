/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {kuruviProto, serverCredentials} = require('./src/common/grpc');
const {exififyAlbum} = require('./src/services');
const {EXIF_API_PORT} = require('./src/common/config');
const grpc = require('grpc');

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(kuruviProto.ExifApi.service, {
      exififyAlbum: exififyAlbum
  });
  return server;
}

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var server = getServer();
    server.bind(`0.0.0.0:${EXIF_API_PORT}`, serverCredentials);
    server.start();
}