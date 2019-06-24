const { Client } = require('pg');

const tableName = 'photos';
const loadDataInRelation = (data, onSuccessCallback) => {
  const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'photoman',
      password: 'postgres',
      port: 5432,
    });

  client.connect();

  const dataAsArray = [data.album, data.path, data.filename];

  const insert_row = (tableName) => `INSERT INTO ${tableName}(
    album,
    path,
    filename
    ) VALUES($1,$2,$3)`;

  const INSERT_ROW = insert_row(tableName);

  client.query(INSERT_ROW, dataAsArray)
      .then(_ => client.end())
      .then(_ => onSuccessCallback(data.path))
      .catch(e => console.error(e.stack))
};

module.exports = {loadDataInRelation}
