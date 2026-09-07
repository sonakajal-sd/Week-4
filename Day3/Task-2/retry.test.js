const fetchWithRetry = require("./retry");

test("retry throws error when all attempts fail", async () => {
  const mockFetch = jest.fn()
    .mockImplementationOnce(() => {
      throw new Error("First attempt failed");
    })
    .mockImplementationOnce(() => {
      throw new Error("Second attempt failed");
    });

  await expect(
    fetchWithRetry(mockFetch, 1)
  ).rejects.toThrow("Second attempt failed");

  expect(mockFetch).toHaveBeenCalledTimes(2);
});