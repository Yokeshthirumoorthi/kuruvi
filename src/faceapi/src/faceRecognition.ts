import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';
export async function describe(faceFilePath) {

      await faceDetectionNet.loadFromDisk('./weights')
      await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
      await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')

      const faceImage = await canvas.loadImage(faceFilePath);
      
      const results = await faceapi.detectAllFaces(faceImage, faceDetectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      return results;
}