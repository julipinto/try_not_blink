import { debouncer } from '../utils/debouncer.js';
const shouldRun = debouncer({ timerDelay: 500 });

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
      { maxFaces: 2 } // MUDAR ISSO AQUI
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

  #middleBounding(boundingBox) {
    if (!boundingBox) return [Infinity, Infinity];
    const [y1, x1] = boundingBox.topLeft;
    const [y2, x2] = boundingBox.bottomRight;

    return { x: (x2 - x1) / 2, y: (y1 - y2) / 2 };
  }

  async handBlinked(video) {
    // console.debug(this.#detector);
    const predictions = await this.#estimateFaces(video);
    if (!predictions.length) return false;

    // IF PREDICTIONS != 2, ALERT USER

    let mostLeft = Math.min(
      this.#middleBounding(predictions[0].boundingBox).x,
      this.#middleBounding(predictions[1]?.boundingBox).x || Infinity
    );

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
      if (!shouldRun()) continue;

      // if (prediction.boundingBox.topLeft[1] === mostLeft) return blinked;
      return blinked;
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
