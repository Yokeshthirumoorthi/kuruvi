
const {kuruviProto, credentials} = require('../common/grpc');
const {FACE_DESCRIBE_ENDPOINT} = require('../common/config');

function getDescriptors(message, nextJob) {
    const faceDescribeService = new kuruviProto.FaceDescribe(FACE_DESCRIBE_ENDPOINT, credentials);
    faceDescribeService.describeFaces(message, (err, res) => {
        console.log("Describe faces Res: ", err, res);
        // nextJob()
    })
}
function describeFacePoints(message, nextJob) {
    const albumName = message.albumName;
    const faces = message.faces;
    faces.map(face => {
        const photoName = face.name;
        const faceDescribeRequest = {
            albumName, photoName
        };
        getDescriptors(faceDescribeRequest, nextJob)
    });

}

module.exports = {describeFacePoints}