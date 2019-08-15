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

const STATIC_GENERATOR_SERVICE= process.env.STATIC_GENERATOR_SERVICE;
const STATIC_GENETATOR_PORT= process.env.STATIC_GENETATOR_PORT;

const STATIC_GENERATOR_ENDPOINT= `0.0.0.0:${STATIC_GENETATOR_PORT}`;

export {
    STATIC_GENERATOR_ENDPOINT,
    STATIC_GENETATOR_PORT,
    STATIC_GENERATOR_SERVICE
}