const {
  chunk,
  zip,
  groupBy,
  pipe,
  compose,
  curry,
  partial
} = require("./utils");


// ==========================================
// CHUNK
// ==========================================

test("chunk splits an array into groups", () => {
  expect(chunk([1, 2, 3, 4], 2))
    .toEqual([
      [1, 2],
      [3, 4]
    ]);
});


test("chunk handles an empty array", () => {
  expect(chunk([], 2)).toEqual([]);
});


test("chunk throws an error for invalid size", () => {
  expect(() => chunk([1, 2, 3], 0))
    .toThrow("Size must be greater than 0");
});


// ==========================================
// ZIP
// ==========================================

test("zip combines two arrays", () => {
  expect(zip(["a", "b", "c"], [1, 2, 3]))
    .toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3]
    ]);
});


test("zip handles arrays of different lengths", () => {
  expect(zip(["a", "b"], [1, 2, 3]))
    .toEqual([
      ["a", 1],
      ["b", 2]
    ]);
});


test("zip throws an error for non-array input", () => {
  expect(() => zip("hello", [1, 2]))
    .toThrow("Both inputs must be arrays");
});


// ==========================================
// GROUP BY
// ==========================================

test("groupBy groups objects by a property", () => {
  const users = [
    { name: "A", age: 20 },
    { name: "B", age: 30 },
    { name: "C", age: 20 }
  ];

  expect(groupBy(users, "age"))
    .toEqual({
      20: [
        { name: "A", age: 20 },
        { name: "C", age: 20 }
      ],
      30: [
        { name: "B", age: 30 }
      ]
    });
});


test("groupBy handles an empty array", () => {
  expect(groupBy([], "age")).toEqual({});
});


test("groupBy throws an error for non-array input", () => {
  expect(() => groupBy("hello", "age"))
    .toThrow("First argument must be an array");
});


// ==========================================
// PIPE
// ==========================================

test("pipe applies functions from left to right", () => {
  const double = x => x * 2;
  const addOne = x => x + 1;

  expect(pipe(double, addOne)(5)).toBe(11);
});


test("pipe returns the original value with no functions", () => {
  expect(pipe()(10)).toBe(10);
});


test("pipe throws an error for an invalid function", () => {
  expect(() => pipe(null)(10)).toThrow();
});


// ==========================================
// COMPOSE
// ==========================================

test("compose applies functions from right to left", () => {
  const double = x => x * 2;
  const addOne = x => x + 1;

  expect(compose(double, addOne)(5)).toBe(12);
});


test("compose returns the original value with no functions", () => {
  expect(compose()(10)).toBe(10);
});


test("compose throws an error for an invalid function", () => {
  expect(() => compose(null)(10)).toThrow();
});


// ==========================================
// CURRY
// ==========================================

test("curry accepts arguments one at a time", () => {
  const add = (a, b, c) => a + b + c;

  const curriedAdd = curry(add);

  expect(curriedAdd(1)(2)(3)).toBe(6);
});


test("curry handles all arguments at once", () => {
  const add = (a, b) => a + b;

  const curriedAdd = curry(add);

  expect(curriedAdd(2, 3)).toBe(5);
});


test("curry throws an error for non-function input", () => {
  expect(() => curry(null)).toThrow();
});


// ==========================================
// PARTIAL
// ==========================================

test("partial fixes some arguments", () => {
  const multiply = (a, b, c) => a * b * c;

  const multiplyByTwo = partial(multiply, 2);

  expect(multiplyByTwo(3, 4)).toBe(24);
});


test("partial works with no fixed arguments", () => {
  const add = (a, b) => a + b;

  const partiallyApplied = partial(add);

  expect(partiallyApplied(2, 3)).toBe(5);
});


test("partial throws an error for non-function input", () => {
  expect(() => partial(null, 10)).toThrow();
});     