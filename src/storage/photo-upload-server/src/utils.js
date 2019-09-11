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
const path = require('path');
const services = require('./services');

const WORKDIR = '/srv'; //TODO: use value from dotenv
const ALBUM_UPLOADS = 'album-uploads'; //TODO: use value from dotenv
const UPLOADS ='uploads';

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
  const albumPath = await getAlbumUploadsPath(fields.albumName);

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
      
      // const savePhotoRequest = getSavePhotoRequest(fields);
      // services.savePhoto(savePhotoRequest);

      onSuccess({fields, files});
    });
  })
}

// async function generateStaticPage(albumName) {
//   const albumInfo = {name: albumName};
//   services.initWorkFlow(albumInfo);
// }

/**
 * 
 * After upload is completed, the generate
 * static pages job is triggered via grpc
 * @param {*} albumName Album for which static page is generated
 */
async function generateStaticPage(albumName) {
  const message = await getInitWorkFlowRequestMessage(albumName);
  services.initWorkFlow(message);
}

// async function createNewAlbum(albumName) {
//   await services.createAlbum(albumName)
// }
/**
 * 
 * Album name and the list of files are passed as
 * grpc request to do the photo-organising 
 * @param {*} albumName Album for which workflow is being kicked off
 */
async function getInitWorkFlowRequestMessage(albumName) {
  const photos = await getFileNamesInDir(albumName);
  const message = {
    albumName: albumName,
    photos: photos
  };
  return message;
}

/**
 * Reads the directory and lists down 
 * the names of files in it.
 * @param {*} albumName The album name
 */
async function getFileNamesInDir(albumName) {
  const albumPath = await getAlbumUploadsPath(albumName)
  const fileNames = fs.readdirSync(albumPath);
  return fileNames;
}

/**
 * 
 * Provide a resolved path from
 * workdir to the uploads folders
 * @param {*} albumName Folder where photos are uploaded
 */
async function getAlbumUploadsPath(albumName) {
  // the path has 4 components -
  // 1. workdir ususally the one mentioned as docker workdir
  // 2. name of the volume used to store the uploaded photos
  // 3. album name and uploads folder
  const albumPath = path.resolve(WORKDIR, ALBUM_UPLOADS, albumName, UPLOADS);
  // Ensure the folder exists before returning the resolved path
  await makeDir(albumPath);
  return albumPath;
}

// function getSavePhotoRequest(fields) {
//   const savePhotoRequest = {
//     albumName: fields.albumName,
//     photoName: fields.name
//   };

//   return savePhotoRequest;
// }

module.exports = {saveFileToDisk, generateStaticPage }