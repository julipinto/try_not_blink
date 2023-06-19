export default class Controller {
  #worker;
  #view;
  #camera;
  #running;

  constructor({ worker, view, camera }) {
    this.#view = view;
    this.#camera = camera;
    this.#worker = this.#configureWorker(worker);
    this.#view.configureOnBtnClick(this.onBtnStartToggle.bind(this));
    this.#running = false;
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    return controller;
  }

  #configureWorker(worker) {
    let isReady = false;
    worker.onmessage = ({ data }) => {
      if (data.status === 'IMPORT READY') {
        worker.postMessage(this.#getVideoFrame());
        this.#view.loadingFirstDetection();
      } else if (data.status === 'READY') {
        isReady = true;
        this.#view.enableGame();
      } else if (data.status === 'BLINK') {
        if (!this.#running) return;
        const { blinked } = data;
        if (blinked) console.log('BLINKED');
        this.loop();
      }
    };

    return {
      postMessage(msg) {
        if (!isReady) return;
        worker.postMessage(msg);
      },
    };
  }

  loop() {
    this.#worker.postMessage(this.#getVideoFrame());
  }

  #getVideoFrame() {
    const { video } = this.#camera;
    const img = this.#view.getVideoFrame(video);
    return img;
  }

  onBtnStartToggle() {
    if (this.#running) {
      this.onBtnStopClick();
    } else {
      this.onBtnStartClick();
    }
  }

  onBtnStartClick() {
    this.#running = true;
    this.#view.setIconPause();
    // TIMER TO START THE GAME
    this.loop();
  }

  onBtnStopClick() {
    this.#running = false;
    this.#view.setIconPlay();
  }
}
