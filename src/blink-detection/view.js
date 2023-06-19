export default class View {
  #btnStart = document.querySelector('#btn-start');
  #banner = document.querySelector('#banner');
  #iconD = document.querySelector('#icon-button');
  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  #eyep1 = document.querySelector('#eyep1');
  #eyep2 = document.querySelector('#eyep2');

  constructor() {
    let bntHelp = document.querySelector('#btnHelp');
    let dialogHelp = document.querySelector('#dialogHelp');
    let closeDialog = document.querySelector('#closeDialog');

    bntHelp.addEventListener('click', function () {
      let isOpen = dialogHelp.hasAttribute('open');
      if (!isOpen) {
        dialogHelp.showModal();
      } else {
        dialogHelp.close();
      }
    });

    closeDialog.addEventListener('click', function () {
      dialogHelp.close();
    });
  }

  enableGame() {
    this.#btnStart.disabled = false;
    this.hideBanner();
  }

  hideBanner() {
    if (this.#banner.style.display !== 'none') {
      this.#banner.style.display = 'none';
    }
  }

  loadingFirstDetection() {
    this.#banner.textContent = 'Carregando detecção facial...';
  }

  bannerMessage(msg) {
    this.#banner.style.display = 'block';
    this.#banner.textContent = msg;
  }

  setIconPlay() {
    this.#openEye();
    this.#iconD.setAttribute(
      'd',
      'm10 16.5l6-4.5l-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z'
    );
  }

  setIconPause() {
    this.#closeEye();
    this.#iconD.setAttribute(
      'd',
      'M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm1-4h2V8h-2v8z'
    );
  }

  #openEye() {
    this.#eyep1.setAttribute(
      'd',
      'M224 104c-16.81 20.81-47.63 48-96 48s-79.19-27.19-96-48c16.81-20.81 47.63-48 96-48s79.19 27.19 96 48Z'
    );
    this.#eyep2.setAttribute(
      'd',
      'M228 175a8 8 0 0 1-10.92-3l-19-33.2A123.23 123.23 0 0 1 162 155.46l5.87 35.22a8 8 0 0 1-6.58 9.21a8.4 8.4 0 0 1-1.29.11a8 8 0 0 1-7.88-6.69l-5.77-34.58a133.06 133.06 0 0 1-36.68 0l-5.77 34.58A8 8 0 0 1 96 200a8.4 8.4 0 0 1-1.32-.11a8 8 0 0 1-6.58-9.21l5.9-35.22a123.23 123.23 0 0 1-36.06-16.69L39 172a8 8 0 1 1-13.94-8l20-35a153.47 153.47 0 0 1-19.3-20a8 8 0 1 1 12.46-10c16.6 20.54 45.64 45 89.78 45s73.18-24.49 89.78-45a8 8 0 1 1 12.44 10a153.47 153.47 0 0 1-19.3 20l20 35a8 8 0 0 1-2.92 11Z'
    );
  }

  #closeEye() {
    this.#eyep1.setAttribute(
      'd',
      'M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72Zm0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z'
    );
    this.#eyep2.setAttribute(
      'd',
      'M247.31 124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57 61.26 162.88 48 128 48S61.43 61.26 36.34 86.35C17.51 105.18 9 124 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208s66.57-13.26 91.66-38.34c18.83-18.83 27.3-37.61 27.65-38.4a8 8 0 0 0 0-6.5ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.47 133.47 0 0 1 25 128a133.33 133.33 0 0 1 23.07-30.75C70.33 75.19 97.22 64 128 64s57.67 11.19 79.93 33.25A133.46 133.46 0 0 1 231.05 128c-7.21 13.46-38.62 64-103.05 64Zm0-112a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z'
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
