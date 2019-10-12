/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const crypto = require('crypto')

const KEY = '943b421c9eb07c830af81030552c86009268de4e532ba2ee2eab8247c6da0881'
const SALT = '520f986b998545b4785e0defbc4f3c1203f22de2374a3d53cb7a7fe9fea309c5'

const urlSafeBase64 = (string) => {
  return new Buffer(string).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret) => {
  const hmac = crypto.createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}

const getSignedImgCropURL= (caddyURL, boundingBox) => {
  const url = caddyURL;
  const resizing_type = 'fit';
  const x = boundingBox.x;
  const y = boundingBox.y;
  const w = boundingBox.width;
  const h = boundingBox.height;
  const gravity = `nowe:${x}:${y}`;
  const enlarge = 0;
  const extension = 'jpg';
  const encoded_url = urlSafeBase64(url);
  const path = `/rt:${resizing_type}/c:${w}:${h}:${gravity}/el:${enlarge}/${encoded_url}.${extension}`;

  const signature = sign(SALT, path, KEY);
  const result = `/${signature}${path}`;
  return result;
}

module.exports = {getSignedImgCropURL}
