/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
var shell = require('shelljs');

function execShellScript(script, errMsg) {
  if (shell.exec(script).code !== 0) {
    shell.echo(errMsg);
    shell.exit(1);
  } 
}

function getScannerScript(albumName, cachePath) {
  return `scanner/main.py album-uploads/${albumName} ${cachePath}`;
}

function getCopyFacesScript(albumName, facePath) {
  return `cp -r album-faces/${albumName}/* ${facePath}`;
}

function getCopyResizedScript(albumName, resizedPath) {
  return `cp -r album-resized/${albumName}/* ${resizedPath}`;
}

function getCopyWebScript(path) {
  return `cp -r web/* ${path}`; 
}

function getCreateExifFolderScript(src, dest, photos) {
  const actualSrc = `${src}/uploads`;
  const filePaths = photos.map(x => `${actualSrc}/${x}`).join(' ');
  return `cp ${filePaths} ${dest}`;
}

function execScanner(albumName, cachePath) {
  const script = getScannerScript(albumName, cachePath);
  const errMsg ='Error: Photo scanner failed'; 
  execShellScript(script, errMsg);
}

function execCopyStaticJS(path) {
  const script = getCopyWebScript(path);
  const errMsg = 'Error: Prepare static folder failed';
  execShellScript(script,errMsg);
}

function execCopyFaces(albumName, facePath) {
  const script = getCopyFacesScript(albumName, facePath);
  const errMsg ='Error: Face copy job failed'; 
  execShellScript(script, errMsg);
}

function execCopyResized(albumName, facePath) {
  const script = getCopyResizedScript(albumName, facePath);
  const errMsg ='Error: Resized copy job failed'; 
  execShellScript(script, errMsg);
}

function execExifFolderCreation(src, dest, photos) {
  const script = getCreateExifFolderScript(src, dest, photos);
  const errMsg = 'Error: Create exif tag folder @ ' + dest;
  execShellScript(script, errMsg);
}

module.exports = {execScanner, execCopyStaticJS, execExifFolderCreation, execCopyFaces, execCopyResized} 