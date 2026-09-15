import { describe, it, expect, beforeEach } from "vitest";

import { renderDetailPage } from "../../pages/detail.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";

describe("renderDetailPage", () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(
      createInitialState({
        items: [{ id: "1", title: "Buy milk", done: false, createdAt: 0 }]
      }),
      reducer
    );
  });

  it("renders the task matching the id param", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    expect(element.querySelector("h2").textContent).toBe("Buy milk");
    expect(element.querySelector(".detail-status").textContent).toBe("Status: Pending");
  });

  it("shows a not-found message for an unknown id", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "does-not-exist" }
    });

    expect(element.querySelector("h2").textContent).toBe("Task not found");
  });

  it("dispatches UPDATE_ITEM to toggle done state", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    const toggleButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      btn.textContent.includes("Mark Done")
    );

    toggleButton.click();

    expect(store.getState().items[0].done).toBe(true);
  });

  it("navigates back to the list when Back is clicked", () => {
    let navigatedTo = null;
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: { id: "1" }
    });

    const backButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Back"
    );

    backButton.click();

    expect(navigatedTo).toBe("/list");
  });

  it("shows the error banner when state.error is set", () => {
    store.dispatch({ type: "SET_ERROR", payload: "Save failed" });

    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    expect(element.querySelector(".error-banner").textContent).toBe("Save failed");
  });

  it("opens a confirmation modal and deletes then navigates on confirm", () => {
    let navigatedTo = null;
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: { id: "1" }
    });
    document.body.append(element);

    const deleteButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Delete"
    );
    deleteButton.click();

    const confirmButton = Array.from(
      document.querySelectorAll(".modal-actions button")
    ).find((btn) => btn.textContent === "Delete");
    confirmButton.click();

    expect(store.getState().items).toHaveLength(0);
    expect(navigatedTo).toBe("/list");
  });

  it("submits the edit form and dispatches an updated title", async () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    const input = element.querySelector("input");
    input.value = "Buy oat milk";
    element.querySelector("form").dispatchEvent(new Event("submit", { cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(store.getState().items[0].title).toBe("Buy oat milk");
  });
});
