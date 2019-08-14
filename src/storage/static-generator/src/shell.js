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

function getCopyWebScript(path) {
  return `cp -r web/* ${path}`; 
}

function execScanner(albumName, cachePath) {
  const script = getScannerScript(albumName, cachePath);
  const errMsg ='Error: Photo scanner failed'; 
  execShellScript(script, errMsg);
}

function execCopyStaticJS(path) {
  const script = getCopyWebScript(path);
  const errMsg = 'Error: Prepare static folder failed';
  execShellScript(script, path);
}

module.exports = {execScanner, execCopyStaticJS} 