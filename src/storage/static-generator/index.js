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

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000 // 30 days
  /** add other headers as per requirement */
}

http.createServer(async function (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if (req.url === '/staticgen' && req.method.toLowerCase() == 'get') {
    const __baseDir = 'album-static-gen';
    const albumName = 'album2';
    const albumPath = `${__baseDir}/${albumName}`;
    const cachePath = `${albumPath}/cache`;
    await utils.createDirectory(albumPath);
    await utils.createDirectory(cachePath);
    utils.prepareStaticFolder(albumPath);
    utils.runStaticGenerator(albumName, cachePath);
  }

}).listen(8001, () => {
  console.log('server started')
})
