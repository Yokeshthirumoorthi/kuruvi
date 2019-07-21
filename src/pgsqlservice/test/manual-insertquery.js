const dbquery = require('../src/dbquery');

const albumRow = {
    name: 'test_album',
    path: 'test_path'
};

const photoRow = {
    albumId: 2,
    name: 'test_photo'
};

const exifRow = {
    make: 'test_make',
    model: 'test_model',
    createOn: 12345,
    imageWidth: 12345,
    imageHeight: 12345
};

async function run() {
    // await dbquery.albumInsertRow(albumRow);
    // await dbquery.photoInsertRow(photoRow);
    await dbquery.exifInsertRow(exifRow);
}

run();