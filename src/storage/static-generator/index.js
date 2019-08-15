// /*
//  *
//  * Copyright © 2019 Yokesh Thirumoorthi.
//  *
//  * [This program is licensed under the "MIT License"]
//  * Please see the file LICENSE in the source
//  * distribution of this software for license terms.
//  *
//  */

// var http = require('http')
// const utils = require('./src/utils')
// const { parse } = require('querystring');

// const headers = {
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
//   'Access-Control-Max-Age': 2592000 // 30 days
//   /** add other headers as per requirement */
// }

// function collectRequestData(request, callback) {
//   let body = '';
//       request.on('data', chunk => {
//           body += chunk.toString();
//       });
//       request.on('end', () => {
//           callback(parse(body));
//   });
// }

// http.createServer(function (req, res) {
//   if (req.method === 'OPTIONS') {
//     res.writeHead(204, headers)
//     res.end()
//     return
//   }

//   if (req.url === '/staticgen' && req.method.toLowerCase() == 'post') {
//     collectRequestData(req, result => {
//       const albumName = result.albumName;
//       utils.generateStaticPage(albumName);
//     });
//   }

// }).listen(8001, () => {
//   console.log('server started')
// })
/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {kuruviProto, credentials} = require('./src/grpc');
const {createExifFolders} = require('./src/services');
const {
    // STATIC_GENERATOR_PORT,
    STATIC_GENERATOR_ENDPOINT
} = require('./config');

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addProtoService(kuruviProto.StaticGenerator.service, {
      createExifFolders: createExifFolders
    });
    return server;
  }

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var server = getServer();
    server.bind(STATIC_GENERATOR_ENDPOINT, credentials);
    server.start();
}