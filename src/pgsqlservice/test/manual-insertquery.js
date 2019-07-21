const dbquery = require('../src/dbquery');

const albumRow = {
    name: 'test_album',
    path: 'test_path'
};

dbquery.albumInsertRow(albumRow);