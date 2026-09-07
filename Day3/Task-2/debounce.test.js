const debounce = require("./debounce");

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("debounce delays function execution", () => {
  const mockFunction = jest.fn();

  const debouncedFunction = debounce(mockFunction, 1000);

  debouncedFunction();

  expect(mockFunction).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  expect(mockFunction).toHaveBeenCalledTimes(1);
});


test("debounce only executes the latest call", () => {
  const mockFunction = jest.fn();

  const debouncedFunction = debounce(mockFunction, 1000);

  debouncedFunction("first");

  jest.advanceTimersByTime(500);

  debouncedFunction("second");

  jest.advanceTimersByTime(1000);

  expect(mockFunction).toHaveBeenCalledTimes(1);
  expect(mockFunction).toHaveBeenCalledWith("second");
});