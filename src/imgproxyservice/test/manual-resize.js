const service = require('../src/resize');

const photoFSDetails = {
    album: 'album1',
    photo: 'bbt1.jpg'
};

service.resizeImageAndSave(photoFSDetails);