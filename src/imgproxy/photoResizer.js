const fs = require('../fs/saveFile');
const rabbit = require('../rabbitmq/receive');
const pg = require('../database/postgres');
const signature = require('./signature');
const Axios = require('axios');

/* ============================================================
  Function: Download Image
============================================================ */
async function downloadImage (imagePath) {
  const url = `local:///${imagePath.album}/${imagePath.photo}`;

  const signedUrlSegment = signature.getSignedImgURL(url);
  const signedUrl = `http://localhost:8080${signedUrlSegment}`;

  const response = await Axios({
    url: signedUrl,
    method: 'GET',
    responseType: 'stream'
  })

  return response;
}

rabbit.receiveMessage((photo_id) => {
  pg.getAlbumPhotoPath(photo_id).then(async (imagePath) => {
    const download_response = await downloadImage(imagePath);
    await fs.saveFile(imagePath, download_response);
  })
});
