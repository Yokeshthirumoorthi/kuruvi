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
    photoId: 2,
    make: 'test_make',
    model: 'test_model',
    createOn: 12345,
    imageWidth: 12345,
    imageHeight: 12345
};

const boundingBoxRow = {
    photoId: 2,
    x: 1,
    y: 2,
    width: 12345,
    height: 12345
}

const faceRow = {
    photoId: 2,
    boundingBoxId: 2, 
    fileName: 'test_name',
    filePath: 'test_path'
}

async function run() {
    // await dbquery.albumInsertRow(albumRow);
    // await dbquery.photoInsertRow(photoRow);
    // await dbquery.exifInsertRow(exifRow);
    // await dbquery.boundingBoxInsertRow(boundingBoxRow);
    await dbquery.faceInsertRow(faceRow);
}

run();