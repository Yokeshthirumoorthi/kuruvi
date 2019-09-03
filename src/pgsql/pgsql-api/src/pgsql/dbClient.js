/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const { Pool } = require('pg');
const {
    PGSQL_USERNAME,
    PGSQL_CORE_SERVICE,
    PGSQL_DB,
    PGSQL_PASSWORD,
    PGSQL_CORE_PORT
} = require('../common/config');

const pool = new Pool({
  user: PGSQL_USERNAME,
  host: PGSQL_CORE_SERVICE,
  database: PGSQL_DB,
  password: PGSQL_PASSWORD,
  port: PGSQL_CORE_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
//   release: () => pool.release()
}