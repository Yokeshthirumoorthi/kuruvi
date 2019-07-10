"use strict";
exports.__esModule = true;
var faceapi = require("face-api.js");
// export const faceDetectionNet = faceapi.nets.ssdMobilenetv1
// export const faceDetectionNet = tinyFaceDetector
exports.faceDetectionNet = faceapi.nets.mtcnn;
// SsdMobilenetv1Options
var minConfidence = 0.5;
// TinyFaceDetectorOptions
var inputSize = 408;
var scoreThreshold = 0.5;
// MtcnnOptions
var minFaceSize = 50;
var scaleFactor = 0.8;
function getFaceDetectorOptions(net) {
    return net === faceapi.nets.ssdMobilenetv1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence })
        : (net === faceapi.nets.tinyFaceDetector
            ? new faceapi.TinyFaceDetectorOptions({ inputSize: inputSize, scoreThreshold: scoreThreshold })
            : new faceapi.MtcnnOptions({ minFaceSize: minFaceSize, scaleFactor: scaleFactor }));
}
exports.faceDetectionOptions = getFaceDetectorOptions(exports.faceDetectionNet);
