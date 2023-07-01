function checkWorkerSupport() {
  let supports = false;
  const tester = {
    get type() {
      supports = true;
    },
  };

  try {
    const testWorker = new Worker('blob://', tester);
    testWorker.terminate();
  } finally {
    return supports;
  }
}

export { checkWorkerSupport };
