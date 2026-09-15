export function createStore(initialState, reducer, middlewares = []) {
  let state = initialState;
  let listeners = [];

  function getState() {
    return state;
  }

  function baseDispatch(action) {
    state = reducer(state, action);
    listeners.slice().forEach((listener) => listener(state, action));
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  const store = { getState, subscribe };

  store.dispatch = middlewares.reduceRight(
    (next, middleware) => middleware(store)(next),
    baseDispatch
  );

  return store;
}

export function createStorageMiddleware(key, select = (state) => state) {
  return (store) => (next) => (action) => {
    const result = next(action);

    try {
      localStorage.setItem(key, JSON.stringify(select(store.getState())));
    } catch (err) {
      console.warn("Failed to persist state to localStorage", err);
    }

    return result;
  };
}

export function loadPersistedState(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("Failed to load persisted state from localStorage", err);
    return fallback;
  }
}
