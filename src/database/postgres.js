// const createAlbum;
// const insertPhoto;
// const insertExif;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'photoman',
  password: 'postgres',
  port: 5432,
});

const tableName = 'photos';

const createAlbum = async (albumName, path) => {
  const client = await pool.connect();
  const values = [albumName, path];
  return client.query('INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id', values);
}

const insertPhoto = async (data) => {
  const client = await pool.connect();

  const albums = await client.query('SELECT id FROM albums WHERE name = $1 AND path = $2',[data.album, data.path]);

  const album_id = albums.rows[0].id;

  const insert_row = (tableName) => `INSERT INTO ${tableName}(
    album_id,
    name
    ) VALUES($1,$2) RETURNING id`;

  const INSERT_ROW = insert_row(tableName);

  const { rows } = await client.query(INSERT_ROW, [album_id, data.filename])

  return rows[0].id;
}

const getPhotoFullPath = async (photo_id) => {

  const client = await pool.connect();

  const { rows } = await client.query('SELECT * FROM photos WHERE id = $1',[photo_id]);

  const photo = rows[0];

  const albums = await client.query('SELECT path FROM albums WHERE id = $1',[photo.album_id]);

  const album_path = albums.rows[0].path;

  const path = `${album_path}/${photo.name}`;
  return path;
}

module.exports = {createAlbum, insertPhoto, getPhotoFullPath}
