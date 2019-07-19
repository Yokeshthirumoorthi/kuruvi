const service = require('../src/cropfaces');

const photoFSDetails = {
    album: 'album1',
    photo: 'bbt1.jpg'
};

const photoFaceDetails = {
    photo_id: 1,
    path: '',
    bounding_boxes: [ { x: 986.0000000000001, y: 84, width: 125, height: 125 },
                    { x: 202, y: 133, width: 116, height: 116 },
                    { x: 465.00000000000006, y: 150, width: 113, height: 113 },
                    { x: 717, y: 134, width: 111, height: 111 } ] 
};

service.cropFacesAndSave(photoFSDetails, photoFaceDetails);