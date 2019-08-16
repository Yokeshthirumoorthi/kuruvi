/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const http = require('http')
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
  if (req.url === '/static' && req.method.toLowerCase() === 'post') {
    collectRequestData(req, result => {
      const albumName = result.albumName;
      utils.generateStaticPage(albumName);
      return res.end()
    });
  }
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    const onFailure = (err) => {
      console.log('some error', err)
      res.writeHead(200, headers)
      res.write(JSON.stringify(err))
      return res.end()
    };

    const onSuccess = (result) => {
      res.writeHead(200, headers);
      res.write(JSON.stringify(result));
      res.end();
    };

    // parse a file upload
    utils.saveFileToDisk(req, onSuccess, onFailure);
  }
}).listen(8000, () => {
  console.log('server started')
})
