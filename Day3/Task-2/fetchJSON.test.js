const fetchJSON = require("./fetchJSON");

afterEach(() => {
  jest.restoreAllMocks();
});

test("fetchJSON returns JSON on success", async () => {
  const mockData = { name: "John", age: 25 };

  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(mockData)
  });

  const result = await fetchJSON("https://example.com/user");

  expect(result).toEqual(mockData);
  expect(fetch).toHaveBeenCalledWith("https://example.com/user");
});


test("fetchJSON throws an error when response is not ok", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
    status: 404
  });

  await expect(
    fetchJSON("https://example.com/user")
  ).rejects.toThrow("HTTP error: 404");
});


test("fetchJSON throws an error when network fails", async () => {
  jest.spyOn(global, "fetch")
    .mockRejectedValue(new Error("Network error"));

  await expect(
    fetchJSON("https://example.com/user")
  ).rejects.toThrow("Network error");
});