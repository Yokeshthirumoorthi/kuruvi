/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const makeDir = require('make-dir');
const formidable = require('formidable')
const fs = require('fs');

const WORKDIR = '/srv'; //TODO: use value from dotenv
const ALBUM_UPLOADS = 'album_uploads'; //TODO: use value from dotenv
const UPLOADS ='uploads';

// function getAddPhotoRequest(albumName, fileName) {
//   const folderName =`${__dirname}/uploads/${albumName}`;

//   const AddPhotoRequest = {
//     album: albumName,
//     path: folderName,
//     filename: fileName
//   };

//   return AddPhotoRequest
// };

/**
 * Formidable library writes the uploaded photo into tmp folder.
 * Tis function copies files from tmp folder to appropriate album folders
 * @param {*} oldPath 
 * @param {*} newPath 
 * @param {*} callback 
 */
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

async function getFileLocation(fields, file) {
  const albumPath = `${WORKDIR}/${ALBUM_UPLOADS}/${fields.albumname}/${UPLOADS}`;
  await makeDir(albumPath);

  const fileLoaction = `${albumPath}/${file.name}`;

  return fileLoaction;
}

async function saveFileToDisk(req, onSuccess, onFailure) {
  // parse a file upload
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async function (err, fields, files) {
    if (err) {
      onFailure(err);
    }
    
    var file = files['files[]']
    const fileLoaction = await getFileLocation(fields, file);

    copy(file.path, fileLoaction, function (err) {
      if (err) throw err;
      console.log('original name', file.name)
      console.log('type', file.type)
      console.log('size', file.size)
      
      // const addPhotoRequest = getAddPhotoRequest(albumName, file.name)
      // grpc.savePhotoToDatabase(addPhotoRequest);
      onSuccess({fields, files});
    });
  })
}

module.exports = {saveFileToDisk}