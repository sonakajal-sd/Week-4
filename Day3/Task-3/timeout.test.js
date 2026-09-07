const createTimeoutController = require("./timeout");

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("AbortController aborts after configured duration", () => {
  const controller = createTimeoutController(5000);

  expect(controller.signal.aborted).toBe(false);

  jest.advanceTimersByTime(4999);

  expect(controller.signal.aborted).toBe(false);

  jest.advanceTimersByTime(1);

  expect(controller.signal.aborted).toBe(true);
});


