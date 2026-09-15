import { describe, it, expect } from "vitest";

import { reducer, createInitialState } from "../reducer.js";

describe("reducer", () => {
  it("handles NAVIGATE", () => {
    const state = reducer(createInitialState(), {
      type: "NAVIGATE",
      payload: { path: "/list", params: {} }
    });

    expect(state.route).toBe("/list");
  });

  it("handles ADD_ITEM", () => {
    const state = reducer(createInitialState(), {
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    expect(state.items).toHaveLength(1);
  });

  it("handles UPDATE_ITEM", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, {
      type: "UPDATE_ITEM",
      payload: { id: "1", done: true }
    });

    expect(state.items[0].done).toBe(true);
    expect(state.items[0].title).toBe("Task");
  });

  it("handles DELETE_ITEM", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, { type: "DELETE_ITEM", payload: "1" });

    expect(state.items).toHaveLength(0);
  });

  it("handles RESET_ITEMS", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, { type: "RESET_ITEMS" });

    expect(state.items).toHaveLength(0);
  });

  it("handles SET_LOADING and SET_ERROR", () => {
    let state = reducer(createInitialState(), { type: "SET_LOADING", payload: true });
    expect(state.loading).toBe(true);

    state = reducer(state, { type: "SET_ERROR", payload: "boom" });
    expect(state.error).toBe("boom");
  });

  it("handles SET_THEME", () => {
    const state = reducer(createInitialState(), { type: "SET_THEME", payload: "dark" });
    expect(state.theme).toBe("dark");
  });

  it("returns the same state for unknown actions", () => {
    const initial = createInitialState();
    const state = reducer(initial, { type: "UNKNOWN" });

    expect(state).toBe(initial);
  });
});
