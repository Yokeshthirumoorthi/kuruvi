/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const grpc = require('grpc');
const {kuruviProto} = require('./src/grpc');
const {
    // SERVICE_X_PORT,
    SERVICE_X_ENDPOINT
} = require('./config');

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addProtoService(kuruviProto.ServiceX.service, {
      saveAlbumUpload: saveAlbumUpload
    });
    return server;
  }

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var serviceXServer = getServer();
    serviceXServer.bind(SERVICE_X_ENDPOINT, grpc.ServerCredentials.createInsecure());
    serviceXServer.start();
}