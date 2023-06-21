import Controller from './controller.js';
import View from './view.js';
import Camera from '../utils/Camera.js';

export default class Factory {
  static async initialize() {
    const tfWorkerURL = new URL(
      './blink-detection/tf-worker.js',
      document.location
    );

    // const tfWorkerURL = new URL();
    const camera = await Camera.initialize({ querySelector: '#video-frame' });
    const worker = new Worker(tfWorkerURL, { type: 'module' });

    return Controller.initialize({
      worker,
      view: new View(),
      camera,
    });
  }
}
