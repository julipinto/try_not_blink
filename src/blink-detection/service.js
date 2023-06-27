import { debouncer } from '../utils/debouncer.js';
const shouldRun = debouncer({ timerDelay: 100 });

const EAR_THRESHOLD = 0.27;

export default class Service {
  #faceLandmarksDetection;
  #detector;

  constructor({ faceLandmarksDetection, detector }) {
    this.#faceLandmarksDetection = faceLandmarksDetection;
    this.#detector = detector;
  }

  static async initialize({ faceLandmarksDetection }) {
    const detector = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 2 }
    );

    return new Service({ faceLandmarksDetection, detector });
  }

  // Calculate the position of eyelid to predict a blink

  #getEAR(upper, lower) {
    function eucledianDistance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    return (
      (eucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1]) +
        eucledianDistance(upper[3][0], upper[3][1], lower[2][0], lower[2][1])) /
      (2 *
        eucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
    );
  }

  async handBlinked(video) {
    const predictions = await this.#estimateFaces(video);
    if (!predictions.length) return false;

    // IF PREDICTIONS != 2, ALERT USER
    if (predictions.length !== 2)
      return {
        error:
          'Não foi encontrado 2 faces para o jogo.\nAperte Jogar novamente com os dois jogadores\nem tela para começar.',
      };

    let mostLeft = Math.min(
      predictions[0].annotations.noseTip[0][0],
      predictions[1].annotations.noseTip[0][0]
    );

    const blinks = new Set();

    for (const prediction of predictions) {
      // Right eye parameters
      const lowerRight = prediction.annotations.rightEyeUpper0;
      const upperRight = prediction.annotations.rightEyeLower0;
      const rightEAR = this.#getEAR(upperRight, lowerRight);
      // Left eye parameters
      const lowerLeft = prediction.annotations.leftEyeUpper0;
      const upperLeft = prediction.annotations.leftEyeLower0;
      const leftEAR = this.#getEAR(upperLeft, lowerLeft);
      // True if the eye is closed
      const blinked = leftEAR <= EAR_THRESHOLD || rightEAR <= EAR_THRESHOLD;
      if (!blinked) continue;
      // if (!shouldRun()) continue;

      let isLeft = mostLeft === prediction.annotations.noseTip[0][0];
      blinks.add(isLeft ? 'esquerda' : 'direita');
    }

    if (blinks.size === 2) {
      return { blinked: true, who: 'ambos' };
    }

    if (blinks.has('esquerda')) {
      return { blinked: true, who: 'esquerda' };
    }

    if (blinks.has('direita')) {
      return { blinked: true, who: 'direita' };
    }

    return false;
  }

  #estimateFaces(video) {
    return this.#detector.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true,
    });
  }
}
