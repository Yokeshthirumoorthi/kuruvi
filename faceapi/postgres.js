// const createAlbum;
// const insertPhoto;
// const insertExif;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgresql',
  database: 'kuruvi_photos',
  password: 'postgres',
  port: 5432,
});

const tableName = 'photos';

const createAlbum = async (albumName, path) => {
  const client = await pool.connect();
  const values = [albumName, path];
  const { rows } = client.query('INSERT INTO Albums (name, path) VALUES ($1, $2) RETURNING id', values);
  return rows[0].id;
}

const insertPhoto = async (data) => {
  const client = await pool.connect();

  const albums = await client.query('SELECT id FROM albums WHERE name = $1 AND path = $2',[data.album, data.path]);

  const album_id = albums.rows.length > 0 ? albums.rows[0].id : await createAlbum(data.album, data.path);

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

const getAlbumPhotoPath = async (photo_id) => {

  const client = await pool.connect();

  const { rows } = await client.query('SELECT * FROM photos WHERE id = $1',[photo_id]);

  const photo = rows[0];

  const albums = await client.query('SELECT name FROM albums WHERE id = $1',[photo.album_id]);

  const album_name = albums.rows[0].name;

  const pathDetails = {album: album_name, photo: photo.name};

  return pathDetails;
}

const insertExif = async (photo_id, data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN')

    const values = [data.make, data.model, data.create_on, data.img_width, data.img_height];
    const { rows } = await client.query(`INSERT INTO exif (make, model, create_on, img_width, img_height)
                                    VALUES ($1, $2, $3, $4, $5) RETURNING id`, values);

    const insertPhotoExifRel = 'INSERT INTO photos_exif(photo_id, exif_id) VALUES ($1, $2)'
    const insertRelValues = [photo_id, rows[0].id]

    await client.query(insertPhotoExifRel, insertRelValues)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

const insertFaceDescriptors = async (photo_id, data) => {
  const client = await pool.connect();

  const INSERT_ROW = `INSERT INTO face_descriptors(
    photo_id,
    label
    ) VALUES($1, $2) RETURNING id`;

  const { rows } = await client.query(INSERT_ROW, [photo_id, data._label])

  return rows[0].id;
}

module.exports = {createAlbum, insertPhoto, getPhotoFullPath, insertExif, insertFaceDescriptors, getAlbumPhotoPath}
