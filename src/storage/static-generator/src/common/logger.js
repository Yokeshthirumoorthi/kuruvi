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
const { STATIC_GENERATOR_SERVICE } = require('./config');

const logger = pino({
  name: STATIC_GENERATOR_SERVICE,
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

module.exports = {logger}