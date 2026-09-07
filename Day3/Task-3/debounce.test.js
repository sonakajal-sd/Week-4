const debounce = require("./debounce");

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("debounce calls function only once after 10 rapid calls", () => {
  const mockFunction = jest.fn();

  const debouncedFunction = debounce(mockFunction, 1000);

  for (let i = 0; i < 10; i++) {
    debouncedFunction();
  }

  expect(mockFunction).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  expect(mockFunction).toHaveBeenCalledTimes(1);
});