const { Client } = require('pg');
const rabbit = require('./rabbitmq');

const tableName = 'photos';
const loadDataInRelation = (data) => {
  const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'photoman',
      password: 'postgres',
      port: 5432,
    });

  client.connect();

  const insert_row = (tableName) => `INSERT INTO ${tableName}(
    album,
    path,
    filename
    ) VALUES($1,$2,$3)`;

  const INSERT_ROW = insert_row(tableName);

  client.query(INSERT_ROW, data)
      .then(_ => client.end())
      .then(_ => rabbit.sendMessage(data[1]))
      .catch(e => console.error(e.stack))
};

module.exports = {loadDataInRelation}
