/***************************
Autor: Erick Wendel
Repositório: https://github.com/ErickWendel/semana-javascript-expert07/blob/main/classes/class04/pages/video-player/src/worker.js
Esse código foi uma adaptação do código acima
******************************/

import 'https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js';
import 'https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js';
import 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js';
import 'https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js';
console.info('tf packages imported!');

import Service from './service.js';
let firstDetection = false;

const { tf, faceLandmarksDetection } = self;
tf.setBackend('webgl');

const service = await Service.initialize({ faceLandmarksDetection });
console.log('tf-worker model loaded!');

postMessage({ status: 'IMPORT READY' });

onmessage = async ({ data: video }) => {
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
};
