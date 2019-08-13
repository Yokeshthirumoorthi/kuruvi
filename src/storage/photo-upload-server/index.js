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
const fs = require('fs');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000 // 30 days
  /** add other headers as per requirement */
}

function copy(oldPath, newPath, callback) {
  var readStream = fs.createReadStream(oldPath);
  var writeStream = fs.createWriteStream(newPath);

  readStream.on('error', callback);
  writeStream.on('error', callback);

  readStream.on('close', function () {
      fs.unlink(oldPath, callback);
  });

  readStream.pipe(writeStream);
}

function saveFileToDisk(req, res) {

  // parse a file upload
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async function (err, fields, files) {
    if (err) {
        console.log('some error', err)
        res.writeHead(200, headers)
        res.write(JSON.stringify(err))
        return res.end()
    }
    
    const albumPath = `/srv/album-uploads/${fields.albumname}/uploads`;
    await utils.createAlbumDirectory(albumPath);

    var file = files['files[]']
    const fileLoaction = `${albumPath}/${file.name}`;

    copy(file.path, fileLoaction, function (err) {
      if (err) throw err;
      console.log('original name', file.name)
      console.log('type', file.type)
      console.log('size', file.size)
      
      // const addPhotoRequest = utils.getAddPhotoRequest(albumName, file.name)
      // grpc.savePhotoToDatabase(addPhotoRequest);

      res.writeHead(200, headers)
      res.write(JSON.stringify({ fields, files }))
      res.end()
    });
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
