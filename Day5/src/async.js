export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runAsync(store, task) {
  store.dispatch({ type: "SET_ERROR", payload: null });
  store.dispatch({ type: "SET_LOADING", payload: true });

  try {
    await task();
  } catch (err) {
    store.dispatch({
      type: "SET_ERROR",
      payload: err && err.message ? err.message : "Something went wrong"
    });
  } finally {
    store.dispatch({ type: "SET_LOADING", payload: false });
  }
}
