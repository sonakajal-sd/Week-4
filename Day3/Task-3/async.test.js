const fetchJSON = require("./fetchJSON");

afterEach(() => {
  jest.restoreAllMocks();
});

test("fetchJSON resolves with data", async () => {
  const data = { name: "John", age: 25 };

  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => data
  });

  const result = await fetchJSON("https://example.com/user");

  expect(result).toEqual(data);
});


test("fetchJSON rejects with HttpError on non-200 response", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
    status: 404
  });

  await expect(
    fetchJSON("https://example.com/user")
  ).rejects.toThrow("HTTP error: 404");
});