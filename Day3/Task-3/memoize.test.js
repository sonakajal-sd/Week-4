const memoize = require("./memoize");

test("memoize calls wrapped function once for repeated input", () => {
  const mockFunction = jest.fn(x => x * 2);

  const memoized = memoize(mockFunction);

  expect(memoized(5)).toBe(10);
  expect(memoized(5)).toBe(10);
  expect(memoized(5)).toBe(10);

  expect(mockFunction).toHaveBeenCalledTimes(1);
});


test("memoize calls wrapped function twice for two different inputs", () => {
  const mockFunction = jest.fn(x => x * 2);

  const memoized = memoize(mockFunction);

  expect(memoized(5)).toBe(10);
  expect(memoized(10)).toBe(20);

  expect(mockFunction).toHaveBeenCalledTimes(2);
});