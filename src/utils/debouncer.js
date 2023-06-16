function debouncer({ timerDelay }) {
  let lastEvent = Date.now();
  return function () {
    const result = Date.now() - lastEvent > timerDelay;
    if (result) lastEvent = Date.now();

    return result;
  };
}

export { debouncer };
