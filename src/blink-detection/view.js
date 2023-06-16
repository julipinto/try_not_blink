export default class View {
  #btnStart = document.querySelector('#btn-start');
  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  enableGame() {
    this.#btnStart.disabled = false;
    this.#btnStart.textContent = 'Jogar';
  }

  loadingFirstDetection() {
    this.#btnStart.textContent = 'Carregando detecção facial...';
  }

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas;
    // const [width, height] = [video.videoWidth, video.videoHeight];
    const width = window.innerWidth;
    const height = window.innerWidth;
    canvas.width = width;
    canvas.height = height;

    this.#canvasContext.drawImage(video, 0, 0, width, height);
    return this.#canvasContext.getImageData(0, 0, width, height);
  }

  configureOnBtnClick(onClick) {
    this.#btnStart.addEventListener('click', onClick);
  }
}
