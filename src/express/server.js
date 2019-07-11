/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */


const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const rabbit = require('./rabbitmq');
const grpc = require('./grpc-client');


const app = express();
const port = 8000;

app.get('/', (req, res) => res.send('Hello World!'));

/* Use cors and fileUpload*/
app.use(cors());
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const imageFile = req.files.file;
  const albumName = "album1";
  const folderName =`${__dirname}/uploads/${albumName}`;
  const fileName = `${req.body.filename}`;
  const filePath = `${folderName}/${fileName}`;

  const data = {
    album: albumName,
    path: folderName,
    filename: fileName
  };

  imageFile.mv(filePath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    // grpc.insertPhoto(data).then(res=>rabbit.sendMessage(res.album_id));
    grpc.insertPhoto(data);
    res.json({file: `public/${req.body.filename}.jpg`});
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
