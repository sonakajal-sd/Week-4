async function fetchWithRetry(fetchFunction, retries = 1) {
  try {
    return await fetchFunction();
  } catch (error) {
    if (retries > 0) {
      return fetchWithRetry(fetchFunction, retries - 1);
    }

    throw error;
  }
}

module.exports = fetchWithRetry;