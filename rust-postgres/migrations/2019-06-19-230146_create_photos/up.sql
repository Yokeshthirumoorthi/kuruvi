-- Your SQL goes here
CREATE TABLE albums (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  path VARCHAR NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY NOT NULL,
  album_id INTEGER NOT NULL,
  name VARCHAR NOT NULL
);

CREATE TABLE exif (
  id SERIAL PRIMARY KEY NOT NULL,
  make VARCHAR,
  model VARCHAR,
  create_on INTEGER,
  img_width INTEGER,
  img_height INTEGER
);

CREATE TABLE photos_exif (
  id SERIAL PRIMARY KEY NOT NULL,
  photo_id INTEGER NOT NULL,
  exif_id INTEGER NOT NULL,
  foreign key (photo_id) references photos(id),
  foreign key (exif_id) references exif(id)
);

CREATE TABLE face_descriptors (
  id SERIAL PRIMARY KEY NOT NULL,
  photo_id INTEGER NOT NULL,
  label VARCHAR NOT NULL,
  -- descriptors JSON NOT NULL,
  foreign key (photo_id) references photos(id)
);
