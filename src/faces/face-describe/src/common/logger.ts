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

const config = require('./config');

const logger = pino({
  name: config.EXIF_API_SERVICE,
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

module.exports = {logger}