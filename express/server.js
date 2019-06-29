const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const pg = require('./postgres');
// const rabbit = require('../rabbitmq/send');


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
  const albumName = "uploads";
  const folderName =`${__dirname}/${albumName}`;
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
    pg.insertPhoto(data);//.then(res=>rabbit.sendMessage(String(res)));
    res.json({file: `public/${req.body.filename}.jpg`});
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
