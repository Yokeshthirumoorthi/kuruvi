/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const pino = require('pino');

const {
    PHOTO_UPLOAD_SERVER_SERVICE
} = require('./config');

const logger = pino({
  name: PHOTO_UPLOAD_SERVER_SERVICE,
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

module.exports = {logger}