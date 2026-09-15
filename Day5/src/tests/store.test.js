import { describe, it, expect, beforeEach, vi } from "vitest";

import { createStore, createStorageMiddleware, loadPersistedState } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";

describe("createStore", () => {
  it("returns getState, dispatch and subscribe", () => {
    const store = createStore(createInitialState(), reducer);

    expect(store).toHaveProperty("getState");
    expect(store).toHaveProperty("dispatch");
    expect(store).toHaveProperty("subscribe");
  });

  it("updates state when an action is dispatched", () => {
    const store = createStore(createInitialState(), reducer);

    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    expect(store.getState().items).toHaveLength(1);
    expect(store.getState().items[0].title).toBe("Task");
  });

  it("notifies subscribers after dispatch", () => {
    const store = createStore(createInitialState(), reducer);
    const listener = vi.fn();

    store.subscribe(listener);
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(store.getState(), {
      type: "SET_LOADING",
      payload: true
    });
  });

  it("allows unsubscribing", () => {
    const store = createStore(createInitialState(), reducer);
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(listener).not.toHaveBeenCalled();
  });

  it("runs dispatch through provided middleware", () => {
    const calls = [];
    const loggingMiddleware = () => (next) => (action) => {
      calls.push(action.type);
      return next(action);
    };

    const store = createStore(createInitialState(), reducer, [loggingMiddleware]);
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(calls).toEqual(["SET_LOADING"]);
  });
});

describe("storage middleware + persistence", () => {
  const KEY = "test-day5-state";

  beforeEach(() => {
    localStorage.clear();
  });

  it("persists selected state to localStorage on every dispatch", () => {
    const store = createStore(createInitialState(), reducer, [
      createStorageMiddleware(KEY, (state) => ({ items: state.items }))
    ]);

    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Persisted", done: false, createdAt: 0 }
    });

    const raw = JSON.parse(localStorage.getItem(KEY));
    expect(raw.items).toHaveLength(1);
    expect(raw.items[0].title).toBe("Persisted");
  });

  it("loadPersistedState reads back what was stored", () => {
    localStorage.setItem(KEY, JSON.stringify({ items: [{ id: "1" }] }));

    const loaded = loadPersistedState(KEY, {});
    expect(loaded.items).toHaveLength(1);
  });

  it("loadPersistedState falls back when nothing is stored", () => {
    const loaded = loadPersistedState("missing-key", { items: [] });
    expect(loaded).toEqual({ items: [] });
  });
});
