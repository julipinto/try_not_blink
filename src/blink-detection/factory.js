import Controller from './controller.js';
import View from './view.js';
import Camera from '../utils/Camera.js';
import { getWorker } from './getWorker.js';

export default class Factory {
  static async initialize() {
    const tfWorkerURL = new URL(
      './blink-detection/tf-worker.js',
      document.location
    );

    const camera = await Camera.initialize({ querySelector: '#video-frame' });
    const worker = await getWorker(tfWorkerURL, { type: 'module' });

    return Controller.initialize({
      worker,
      view: new View(),
      camera,
    });
  }
}
