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
      } else if (data.status === 'ERROR') {
        this.#view.bannerMessage(data.error);
        this.#stop();
      } else if (data.status === 'NO BLINK') {
        this.#view.hideBanner();
        if (!this.#running) return;
        this.loop();
      } else if (data.status === 'BLINK') {
        // this.#view.hideBanner();
        const { blinked, who } = data;
        if (blinked) console.log('BLINKED', who);
        this.#stop();
        // this.loop();
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
      this.#stop();
    } else {
      this.#play();
    }
  }

  #play() {
    this.#running = true;
    this.#view.setIconPause();
    // TIMER TO START THE GAME
    this.loop();
  }

  #stop() {
    this.#running = false;
    this.#view.setIconPlay();
  }
}
