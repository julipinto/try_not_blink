/***************************
Autor: Erick Wendel
Repositório: https://github.com/ErickWendel/semana-javascript-expert07/blob/main/classes/class04/pages/video-player/src/factory.js
Esse código foi uma adaptação do código acima
******************************/

import Service from './service.js';

import { checkWorkerSupport } from '../utils/checkWorkerSupport.js';

export async function getWorker(url, options) {
  if (checkWorkerSupport()) {
    console.log('initializing esm workers');
    const worker = new Worker(url, options);
    return worker;
  }

  console.warn(`Your browser doesn't support esm modules on webworkers!`);
  console.warn(`Importing libraries...`);

  await import('https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js');
  await import(
    'https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js'
  );
  await import(
    'https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js'
  );
  await import(
    'https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js'
  );

  console.warn(`using worker mock instead!`);

  const service = await Service.initialize({ faceLandmarksDetection });

  let firstDetection = false;

  const workerMock = {
    async postMessage(video) {
      const result = await service.handBlinked(video);

      if (!firstDetection) {
        firstDetection = true;
        postMessage({ status: 'IMAGE DETECTION READY' });
        console.log('face detection ready!');
        return;
      }

      if (result.error) {
        postMessage({ status: 'ERROR', error: result.error });
        return;
      }

      if (!result) {
        postMessage({ status: 'NO BLINK' });
        return;
      }

      postMessage({
        status: 'BLINK',
        blinked: result.blinked,
        who: result.who,
      });
    },
    //  vai ser sobreescrito pela controller
    onmessage(msg) {},
  };
  console.log('loading tf model...');
  await service.loadModel();
  console.log('tf model loaded!');

  setTimeout(() => worker.onmessage({ data: 'READY' }), 500);
  return workerMock;
}
