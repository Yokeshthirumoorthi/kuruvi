const Axios = require('axios');

/**
 * Get image from imgProxy
 */
async function getImage(imgProxyURL) {
  const image = await httpreq(imgProxyURL)
  return image; 
}

async function buildHugo(url) {
  httpreq(url);
}

async function httpreq(url) {
  const result = await Axios({
    url: url,
    method: 'GET',
    responseType: 'stream'
  });
  return result;
}

module.exports = {getImage, buildHugo}
