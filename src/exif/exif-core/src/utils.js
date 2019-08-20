/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const Axios = require('axios');

/**
 * Get image from remote url
 */
async function getImage(url) {
  const image = await Axios({
    url: url,
    method: 'GET',
    responseType: 'stream'
  });

  return image; 
}

module.exports = {getImage}