
import { describe, it, expect, beforeEach } from "vitest";

import { createRouter } from "../router.js";
import { createStore } from "../store.js";
import { reducer } from "../store.js";
import { renderHomePage } from "../pages/home.js";

describe("Router", () => {
  let store;
  let router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';

    store = createStore(
      {
        route: "/home",
        items: []
      },
      reducer
    );

    router = createRouter(store);

    router.register("/home", renderHomePage);
  });

  it("navigates to a route", () => {
    router.navigate("/home");

    expect(window.location.pathname).toBe("/home");
  });

  it("renders the correct component", () => {
    router.navigate("/home");

    const app = document.getElementById("app");

    expect(app.textContent).toBe("Home Page");
  });

  it("updates the route in the store", () => {
    router.navigate("/home");

    expect(store.getState().route).toBe("/home");
  });
});

