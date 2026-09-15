import { describe, it, expect, beforeEach } from "vitest";

import { renderListPage } from "../../pages/list.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";

describe("renderListPage", () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(createInitialState(), reducer);
  });

  it("shows an empty state when there are no tasks", () => {
    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });

    expect(element.querySelector(".empty-state")).not.toBeNull();
    expect(element.querySelectorAll(".card")).toHaveLength(0);
  });

  it("renders one card per task in state", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "2", title: "Walk dog", done: true, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });

    expect(element.querySelectorAll(".card")).toHaveLength(2);
    expect(element.textContent).toContain("Buy milk");
    expect(element.textContent).toContain("Walk dog");
  });

  it("shows the error banner when state.error is set", () => {
    store.dispatch({ type: "SET_ERROR", payload: "Could not load tasks" });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });

    expect(element.querySelector(".error-banner").textContent).toBe(
      "Could not load tasks"
    );
  });

  it("dispatches DELETE_ITEM when the delete button is clicked", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });
    const deleteButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Delete"
    );

    deleteButton.click();

    expect(store.getState().items).toHaveLength(0);
  });

  it("navigates to the detail route when a task title is clicked", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "42", title: "Buy milk", done: false, createdAt: 0 }
    });

    let navigatedTo = null;
    const element = renderListPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path)
    });

    element.querySelector(".card-title--link").click();

    expect(navigatedTo).toBe("/detail/42");
  });

  it("dispatches UPDATE_ITEM to toggle done state", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });
    const toggleButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      btn.textContent.includes("Mark Done")
    );

    toggleButton.click();

    expect(store.getState().items[0].done).toBe(true);
  });

  it("disables the submit button while loading", () => {
    store.dispatch({ type: "SET_LOADING", payload: true });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });
    const submitButton = element.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe("Adding...");
  });

  it("adds a task through the form submit and clears the input", async () => {
    const element = renderListPage({ state: store.getState(), store, navigate: () => {} });
    const input = element.querySelector("input");
    input.value = "New task";

    element.querySelector("form").dispatchEvent(new Event("submit", { cancelable: true }));
    expect(input.value).toBe("");

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(store.getState().items.some((item) => item.title === "New task")).toBe(true);
  });

  it("produces the same structure for the same state (pure render)", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const stateSnapshot = store.getState();
    const first = renderListPage({ state: stateSnapshot, store, navigate: () => {} });
    const second = renderListPage({ state: stateSnapshot, store, navigate: () => {} });

    expect(first.outerHTML).toBe(second.outerHTML);
  });
});
