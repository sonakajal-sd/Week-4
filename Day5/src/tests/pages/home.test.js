import { describe, it, expect } from "vitest";

import { renderHomePage } from "../../pages/home.js";

describe("renderHomePage", () => {
  it("shows a no-tasks message when there are no items", () => {
    const element = renderHomePage({ state: { items: [] }, navigate: () => {} });
    expect(element.textContent).toContain("no tasks yet");
  });

  it("shows completed/total counts when items exist", () => {
    const element = renderHomePage({
      state: {
        items: [
          { id: "1", done: true },
          { id: "2", done: false }
        ]
      },
      navigate: () => {}
    });

    expect(element.textContent).toContain("1 of 2 tasks completed");
  });

  it("navigates to /list when View Tasks is clicked", () => {
    let navigatedTo = null;
    const element = renderHomePage({
      state: { items: [] },
      navigate: (path) => (navigatedTo = path)
    });

    Array.from(element.querySelectorAll("button"))
      .find((btn) => btn.textContent === "View Tasks")
      .click();

    expect(navigatedTo).toBe("/list");
  });
});
