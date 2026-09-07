const emitter = require("./events");

test("EventEmitter calls listeners with correct arguments", () => {
  const listener1 = jest.fn();
  const listener2 = jest.fn();

  emitter.on("message", listener1);
  emitter.on("message", listener2);

  emitter.emit("message", "hello");

  expect(listener1).toHaveBeenCalledWith("hello");
  expect(listener2).toHaveBeenCalledWith("hello");
});