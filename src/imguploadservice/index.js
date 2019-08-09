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
var formidable = require('formidable')
const utils = require('./src/utils')
const grpc = require('./src/grpc');

const albumName = "album1";
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000 // 30 days
  /** add other headers as per requirement */
}

async function saveFileToDisk(req, res) {
  const albumPath = `./uploads/${albumName}`;
  await utils.createAlbumDirectory(albumPath);

  // parse a file upload
  var form = new formidable.IncomingForm();
  form.uploadDir = albumPath;
  form.keepExtensions = true;

  form.parse(req, function (err, fields, files) {
    if (err) {
        console.log('some error', err)
        res.writeHead(200, headers)
        res.write(JSON.stringify(err))
        return res.end()
    }

    var file = files['files[]']
    console.log('saved file to', file.path)
    console.log('original name', file.name)
    console.log('type', file.type)
    console.log('size', file.size)
    
    // const addPhotoRequest = utils.getAddPhotoRequest(albumName, file.name)
    // grpc.savePhotoToDatabase(addPhotoRequest);

    res.writeHead(200, headers)
    res.write(JSON.stringify({ fields, files }))
    return res.end()
  })
}

http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }
  if (req.url === '/static' && req.method.toLowerCase() == 'get') {
    utils.runStaticGenerator();
  }
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // parse a file upload
    saveFileToDisk(req, res);
  }
}).listen(8000, () => {
  console.log('server started')
})
