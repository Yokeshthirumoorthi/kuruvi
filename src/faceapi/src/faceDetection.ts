import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

async function run(imagePath) {

  await faceDetectionNet.loadFromDisk('./weights')

  const img = await canvas.loadImage(imagePath)
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)

  return detections;
}

export {run}
