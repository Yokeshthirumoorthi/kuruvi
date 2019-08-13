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
const makeDir = require('make-dir');

function runStaticGenerator(albumName, cachePath) {
  // Running external tool synchronously
  if (shell.exec(`scanner/main.py album-uploads/${albumName} ${cachePath}`).code !== 0) {
    shell.echo('Error: Photo scanner failed');
    shell.exit(1);
  }
}

function prepareStaticFolder(path) {
  // Running external tool synchronously
  if (shell.exec(`cp -r web/* ${path}`).code !== 0) {
    shell.echo('Error: Prepare static folder failed');
    shell.exit(1);
  }
}

function createDirectory(path) {
    return  makeDir(path);
}

module.exports = {runStaticGenerator, prepareStaticFolder, createDirectory}