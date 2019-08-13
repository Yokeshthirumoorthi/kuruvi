/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

var http = require('http')
const utils = require('./src/utils')
const { parse } = require('querystring');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000 // 30 days
  /** add other headers as per requirement */
}
function collectRequestData(request, callback) {
  let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          callback(parse(body));
  });
}

http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if (req.url === '/staticgen' && req.method.toLowerCase() == 'post') {
    collectRequestData(req,async result => {
      console.log(result);
      const __baseDir = 'album-static-gen';
      const albumName = result.albumName;
      const albumPath = `${__baseDir}/${albumName}`;
      const cachePath = `${albumPath}/cache`;
      await utils.createDirectory(albumPath);
      await utils.createDirectory(cachePath);
      utils.prepareStaticFolder(albumPath);
      utils.runStaticGenerator(albumName, cachePath);
    });
  }

}).listen(8001, () => {
  console.log('server started')
})
