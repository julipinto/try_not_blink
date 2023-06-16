export default class Camera {
  video;

  constructor({ querySelector }) {
    this.video = document.querySelector(querySelector);

    if (!this.video) {
      this.video = document.createElement('video');
    }
  }
  static async initialize({ querySelector }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available`
      );
    }

    const videoConfig = {
      audio: false,
      video: {},
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    const camera = new Camera({ querySelector });
    // debugger;
    camera.video.srcObject = stream;
    // debug reasons!
    // camera.video.height = 240
    // camera.video.width = 320
    // document.body.append(camera.video)

    // aguarda pela camera!
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });

    camera.video.play();

    return camera;
  }
}
