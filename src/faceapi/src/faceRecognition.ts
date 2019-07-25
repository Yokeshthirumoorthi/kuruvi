import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

// export async function recognize(referenceImagePath, queryImagePath) {

//   const REFERENCE_IMAGE = referenceImagePath;
//   const QUERY_IMAGE = queryImagePath;

//   await faceDetectionNet.loadFromDisk('./weights')
//   await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
//   await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')

//   const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
//   const queryImage = await canvas.loadImage(QUERY_IMAGE)

//   const resultsRef = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
//     .withFaceLandmarks()
//     .withFaceDescriptors()

//   const resultsQuery = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
//     .withFaceLandmarks()
//     .withFaceDescriptors()

//   const faceMatcher = new faceapi.FaceMatcher(resultsRef)

//   return faceMatcher;
// }

export async function describe(faceFilePath) {
      const faceImage = await canvas.loadImage(faceFilePath);

      await faceDetectionNet.loadFromDisk('./weights')
      await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
      await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')

      const results = await faceapi.detectAllFaces(faceImage, faceDetectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      console.log(results);
        
      return results;
}