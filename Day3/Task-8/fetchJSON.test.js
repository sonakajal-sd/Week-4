const fetchJSON = require("./fetchJSON");

afterEach(() => {
  jest.restoreAllMocks();
});

test("returns JSON when fetch succeeds", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ name: "Kajal" })
  });

  const result = await fetchJSON("https://example.com/user");

  expect(result).toEqual({ name: "Kajal" });
});