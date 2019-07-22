import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';
const rabbit = require('./rabbitmq');
const pg = require('./postgres');
const fs = require('fs');



export async function recognize(referenceImagePath, queryImagePath) {

  const REFERENCE_IMAGE = referenceImagePath;
  const QUERY_IMAGE = queryImagePath;

  await faceDetectionNet.loadFromDisk('./weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')

  const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
  const queryImage = await canvas.loadImage(QUERY_IMAGE)

  const resultsRef = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  const resultsQuery = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  const faceMatcher = new faceapi.FaceMatcher(resultsRef)

  return faceMatcher;
}

rabbit.receiveMessage((photo_id) => {
  pg.getPhotoFullPath(photo_id).then(async (imagePath) => {
    const recognitionJson=  await recognize(imagePath, imagePath);
    console.log(recognitionJson);
    recognitionJson._labeledDescriptors.map(async faceDescriptor => await pg.insertFaceDescriptors(photo_id, faceDescriptor));
  })
});
