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

const PGSQL_SERVICE_PORT = process.env.PGSQL_SERVICE_PORT;
const IMGPROXY_SERVICE_PORT = process.env.IMGPROXY_SERVICE_PORT;
const FACEAPI_SERVICE_PORT = process.env.FACEAPI_SERVICE_PORT;
const PGSQL_SERVICE = process.env.PGSQL_SERVICE;
const IMGPROXY_SERVICE = process.env.IMGPROXY_SERVICE;
const PGSQL_SERVICE_API_ENDPOINT = `${PGSQL_SERVICE}:${PGSQL_SERVICE_PORT}`;
const IMGPROXY_SERVICE_API_ENDPOINT = `${IMGPROXY_SERVICE}:${IMGPROXY_SERVICE_PORT}`;
const FACEAPI_SERVICE_API_ENDPOINT =  `0.0.0.0:${FACEAPI_SERVICE_PORT}`;

export {
    PGSQL_SERVICE_API_ENDPOINT,
    IMGPROXY_SERVICE_API_ENDPOINT,
    FACEAPI_SERVICE_API_ENDPOINT,
    FACEAPI_SERVICE_PORT
}