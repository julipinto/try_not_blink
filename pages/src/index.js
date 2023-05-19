const video = document.querySelector('#video-frame');

async function init() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      `Browser API navigator.mediaDevices.getUserMedia not available`
    );

    return;
  }

  const videoConfig = {
    audio: false,
    video: true,
    // {
    // width: globalThis.screen.availWidth,
    // height: globalThis.screen.availHeight,
    // frameRate: {
    //   ideal: 60,
    // },
    // },
  };

  // console.log(await navigator.mediaDevices.getUserMedia({ video }));
  const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
  video.srcObject = stream;
  // debug reasons!
  // video.height = 240;
  // video.width = 320;
  document.body.append(video);

  // aguarda pela camera!
  await new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });

  video.play();

  return video;
}

init();
