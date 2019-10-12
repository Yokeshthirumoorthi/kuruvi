const { FACE_DETECT_ENDPOINT, FACE_CROP_ENDPOINT } = require('../common/config');
const {kuruviProto, credentials} = require('../common/grpc');
const utils = require('./utils');

function detectFacesCallback(err, response) {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log("Inside detect faces callback: ", response)
}


function detectFaces(message) {
    const faceCore= new kuruviProto.FaceCore(FACE_DETECT_ENDPOINT, credentials);
    const {albumName, photoName} = message;
    const fsURL = utils.fsURL(albumName, photoName);
    console.log("fs url  : ", fsURL);
    const photoURL = {
        url: fsURL
    }
    faceCore.detectFaces(photoURL,
        (err, response) => {
            detectFacesCallback(err, response)
        });
}

module.exports = {detectFaces}