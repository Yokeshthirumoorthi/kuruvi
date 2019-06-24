const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const pg = require('../database/postgres');

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
  let imageFile = req.files.file;

  imageFile.mv(`${__dirname}/uploads/${req.body.filename}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    pg.loadDataInRelation(["uploads",`${__dirname}/uploads`, `${req.body.filename}`]);
    res.json({file: `public/${req.body.filename}.jpg`});
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
