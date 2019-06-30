const fs = require('./saveFile');
const rabbit = require('./rabbitmq');
const pg = require('./postgres');
const signature = require('./signature');
const Axios = require('axios');

/* ============================================================
  Function: Download Image
============================================================ */
async function downloadImage (imagePath) {
  const url = `http://caddy-fs:2015/${imagePath.album}/${imagePath.photo}`;
  console.log("caddy url: ", url);
  const signedUrlSegment = signature.getSignedImgURL(url);
  const signedUrl = `http://imgproxy:8080${signedUrlSegment}`;

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
