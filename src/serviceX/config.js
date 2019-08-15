/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
require('dotenv').config();

const SERVICE_X_SERVICE = process.env.SERVICE_X_SERVICE;
const SERVICE_X_PORT = process.env.SERVICE_X_PORT;

const SERVICE_X_ENDPOINT = `0.0.0.0:${SERVICE_X_PORT}`;

export {
    SERVICE_X_PORT,
    SERVICE_X_SERVICE,
    SERVICE_X_ENDPOINT
}