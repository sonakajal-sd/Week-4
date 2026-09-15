import { describe, it, expect, beforeEach } from "vitest";

import { renderSettingsPage } from "../../pages/settings.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";

describe("renderSettingsPage", () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(createInitialState(), reducer);
  });

  it("shows the current theme", () => {
    const element = renderSettingsPage({ state: store.getState(), store });
    expect(element.textContent).toContain("Current theme: light");
  });

  it("dispatches SET_THEME when the theme button is clicked", () => {
    const element = renderSettingsPage({ state: store.getState(), store });
    const themeButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      btn.textContent.includes("Dark Mode")
    );

    themeButton.click();

    expect(store.getState().theme).toBe("dark");
  });

  it("opens a confirmation modal and clears tasks on confirm", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    const element = renderSettingsPage({ state: store.getState(), store });
    document.body.append(element);

    const clearButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Clear All Tasks"
    );
    clearButton.click();

    const confirmButton = Array.from(
      document.querySelectorAll(".modal-actions button")
    ).find((btn) => btn.textContent === "Clear");
    confirmButton.click();

    expect(store.getState().items).toHaveLength(0);
  });
});
