import * as faceapi from 'face-api.js';

import { faceDetectionNet, faceDetectionOptions } from './commons';

async function run(img) {

  await faceDetectionNet.loadFromDisk('./weights')

  // const img = await canvas.loadImage(imagePath)
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)

  return detections;
}

export {run}
