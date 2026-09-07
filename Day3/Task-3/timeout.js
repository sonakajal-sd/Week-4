function createTimeoutController(duration) {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, duration);

  return controller;
}

module.exports = createTimeoutController;