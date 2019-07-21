const pino = require('pino');
const { Client } = require('pg');
const {
    PGSQL_USERNAME,
    PGSQL_HOST,
    PGSQL_DATABASE_NAME,
    PGSQL_PASSWORD
} = require('../config')

const logger = pino({
  name: 'pgsql-service-server',
  messageKey: 'message',
  changeLevelName: 'severity',
  useLevelLabels: true
});

const client = new Client({
  user: PGSQL_USERNAME,
  host: PGSQL_HOST,
  database: PGSQL_DATABASE_NAME,
  password: PGSQL_PASSWORD,
  port: 5432,
});


/**
 * Inserts data into Album table
 */
async function albumInsertRow(data) {
    await client.connect();
//   const albumId = TODO: Implement uuid for id generation
    const albumName = data.name;
    const albumPath = data.path;
    const values = [albumName, albumPath];
    const query = `INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id`; 
    const res = await client.query(query, values);
    await client.end();
    const albumId = res.rows[0].id;
    logger.info(`Successfully inserted row# ${albumId} in album table`);
    return albumId;
}

module.exports = {
    albumInsertRow
}