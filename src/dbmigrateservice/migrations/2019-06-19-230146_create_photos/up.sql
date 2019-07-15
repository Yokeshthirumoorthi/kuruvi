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

CREATE TABLE bounding_boxes (
  id SERIAL PRIMARY KEY NOT NULL,
  photo_id INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  foreign key (photo_id) references photos(id)
);

CREATE TABLE faces (
  id SERIAL PRIMARY KEY NOT NULL,
  bounding_box_id INTEGER NOT NULL,
  path VARCHAR NOT NULL,
  foreign key (bounding_box_id) references bounding_boxes(id)
);

CREATE TABLE face_descriptors (
  id SERIAL PRIMARY KEY NOT NULL,
  face_id INTEGER NOT NULL,
  p1 INTEGER NOT NULL,
  p2 INTEGER NOT NULL,
  p3 INTEGER NOT NULL,
  p4 INTEGER NOT NULL,
  p5 INTEGER NOT NULL,
  p6 INTEGER NOT NULL,
  p7 INTEGER NOT NULL,
  p8 INTEGER NOT NULL,
  p9 INTEGER NOT NULL,
  p10 INTEGER NOT NULL,
  p11 INTEGER NOT NULL,
  p12 INTEGER NOT NULL,
  p13 INTEGER NOT NULL,
  p14 INTEGER NOT NULL,
  p15 INTEGER NOT NULL,
  p16 INTEGER NOT NULL,
  p17 INTEGER NOT NULL,
  p18 INTEGER NOT NULL,
  p19 INTEGER NOT NULL,
  p20 INTEGER NOT NULL,
  p21 INTEGER NOT NULL,
  p22 INTEGER NOT NULL,
  p23 INTEGER NOT NULL,
  p24 INTEGER NOT NULL,
  p25 INTEGER NOT NULL,
  p26 INTEGER NOT NULL,
  p27 INTEGER NOT NULL,
  p28 INTEGER NOT NULL,
  p29 INTEGER NOT NULL,
  p30 INTEGER NOT NULL,
  p31 INTEGER NOT NULL,
  p32 INTEGER NOT NULL,
  p33 INTEGER NOT NULL,
  p34 INTEGER NOT NULL,
  p35 INTEGER NOT NULL,
  p36 INTEGER NOT NULL,
  p37 INTEGER NOT NULL,
  p38 INTEGER NOT NULL,
  p39 INTEGER NOT NULL,
  p40 INTEGER NOT NULL,
  p41 INTEGER NOT NULL,
  p42 INTEGER NOT NULL,
  p43 INTEGER NOT NULL,
  p44 INTEGER NOT NULL,
  p45 INTEGER NOT NULL,
  p46 INTEGER NOT NULL,
  p47 INTEGER NOT NULL,
  p48 INTEGER NOT NULL,
  p49 INTEGER NOT NULL,
  p50 INTEGER NOT NULL,
  p51 INTEGER NOT NULL,
  p52 INTEGER NOT NULL,
  p53 INTEGER NOT NULL,
  p54 INTEGER NOT NULL,
  p55 INTEGER NOT NULL,
  p56 INTEGER NOT NULL,
  p57 INTEGER NOT NULL,
  p58 INTEGER NOT NULL,
  p59 INTEGER NOT NULL,
  p60 INTEGER NOT NULL,
  p61 INTEGER NOT NULL,
  p62 INTEGER NOT NULL,
  p63 INTEGER NOT NULL,
  p64 INTEGER NOT NULL,
  p65 INTEGER NOT NULL,
  p66 INTEGER NOT NULL,
  p67 INTEGER NOT NULL,
  p68 INTEGER NOT NULL,
  p69 INTEGER NOT NULL,
  p70 INTEGER NOT NULL,
  p71 INTEGER NOT NULL,
  p72 INTEGER NOT NULL,
  p73 INTEGER NOT NULL,
  p74 INTEGER NOT NULL,
  p75 INTEGER NOT NULL,
  p76 INTEGER NOT NULL,
  p77 INTEGER NOT NULL,
  p78 INTEGER NOT NULL,
  p79 INTEGER NOT NULL,
  p80 INTEGER NOT NULL,
  p81 INTEGER NOT NULL,
  p82 INTEGER NOT NULL,
  p83 INTEGER NOT NULL,
  p84 INTEGER NOT NULL,
  p85 INTEGER NOT NULL,
  p86 INTEGER NOT NULL,
  p87 INTEGER NOT NULL,
  p88 INTEGER NOT NULL,
  p89 INTEGER NOT NULL,
  p90 INTEGER NOT NULL,
  p91 INTEGER NOT NULL,
  p92 INTEGER NOT NULL,
  p93 INTEGER NOT NULL,
  p94 INTEGER NOT NULL,
  p95 INTEGER NOT NULL,
  p96 INTEGER NOT NULL,
  p97 INTEGER NOT NULL,
  p98 INTEGER NOT NULL,
  p99 INTEGER NOT NULL,
  p100 INTEGER NOT NULL,
  p101 INTEGER NOT NULL,
  p102 INTEGER NOT NULL,
  p103 INTEGER NOT NULL,
  p104 INTEGER NOT NULL,
  p105 INTEGER NOT NULL,
  p106 INTEGER NOT NULL,
  p107 INTEGER NOT NULL,
  p108 INTEGER NOT NULL,
  p109 INTEGER NOT NULL,
  p110 INTEGER NOT NULL,
  p111 INTEGER NOT NULL,
  p112 INTEGER NOT NULL,
  p113 INTEGER NOT NULL,
  p114 INTEGER NOT NULL,
  p115 INTEGER NOT NULL,
  p116 INTEGER NOT NULL,
  p117 INTEGER NOT NULL,
  p118 INTEGER NOT NULL,
  p119 INTEGER NOT NULL,
  p120 INTEGER NOT NULL,
  p121 INTEGER NOT NULL,
  p122 INTEGER NOT NULL,
  p123 INTEGER NOT NULL,
  p124 INTEGER NOT NULL,
  p125 INTEGER NOT NULL,
  p126 INTEGER NOT NULL,
  p127 INTEGER NOT NULL,
  p128 INTEGER NOT NULL,
  foreign key (face_id) references faces(id)
);
