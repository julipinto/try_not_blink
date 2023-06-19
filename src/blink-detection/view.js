export default class View {
  #btnStart = document.querySelector('#btn-start');
  #banner = document.querySelector('#banner');
  #iconD = document.querySelector('#icon-button');
  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  enableGame() {
    this.#btnStart.disabled = false;
    this.#hideBanner();
  }

  #hideBanner() {
    this.#banner.style.display = 'none';
  }

  loadingFirstDetection() {
    this.#banner.textContent = 'Carregando detecção facial...';
  }

  setIconPlay() {
    this.#iconD.setAttribute(
      'd',
      'm10 16.5l6-4.5l-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z'
    );
  }

  setIconPause() {
    this.#iconD.setAttribute(
      'd',
      'M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm1-4h2V8h-2v8z'
    );
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
