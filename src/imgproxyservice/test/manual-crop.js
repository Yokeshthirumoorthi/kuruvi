const service = require('../src/cropfaces');

const photoFSDetails = {
    album: 'album1',
    photo: 'bbt1.jpg'
};

const photoFaceDetails = {
    photo_id: 1,
    path: '',
    bounding_boxes: []
};

service.cropFacesAndSave(photoFSDetails, photoFaceDetails);