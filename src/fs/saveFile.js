const fs = require('fs');
const path = require('path');


function createFolderIfNotExits(fullPath) {
  if (!fs.existsSync(fullPath, { recursive: true })) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}

async function saveFile (imagePath, download_response) {
  createFolderIfNotExits(`${__dirname}/${imagePath.album}`);
  const imgPath = path.resolve(__dirname, imagePath.album, imagePath.photo);
  const writer = fs.createWriteStream(imgPath)

  download_response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = {saveFile}
