import { describe, it, expect, beforeEach } from "vitest";

import { createRouter, matchPath } from "../router.js";
import { createStore } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";
import { renderHomePage } from "../pages/home.js";
import { renderDetailPage } from "../pages/detail.js";

describe("matchPath", () => {
  it("matches a static route", () => {
    expect(matchPath("/home", "/home")).toEqual({});
  });

  it("returns null when segment counts differ", () => {
    expect(matchPath("/home", "/home/extra")).toBeNull();
  });

  it("returns null when static segments differ", () => {
    expect(matchPath("/list", "/home")).toBeNull();
  });

  it("extracts a single dynamic param", () => {
    expect(matchPath("/detail/:id", "/detail/42")).toEqual({ id: "42" });
  });

  it("decodes encoded dynamic params", () => {
    expect(matchPath("/detail/:id", "/detail/a%20b")).toEqual({ id: "a b" });
  });
});

describe("createRouter", () => {
  let store;
  let router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    history.replaceState({}, "", "/");

    store = createStore(createInitialState(), reducer);
    router = createRouter(store);

    router.register("/home", renderHomePage);
    router.register("/detail/:id", renderDetailPage);
  });

  it("navigates to a route and updates the URL", () => {
    router.navigate("/home");

    expect(window.location.pathname).toBe("/home");
  });

  it("renders the matching component into the root element", () => {
    router.navigate("/home");

    const app = document.getElementById("app");
    expect(app.textContent).toContain("Welcome back");
  });

  it("updates the route slice of state on navigate", () => {
    router.navigate("/home");

    expect(store.getState().route).toBe("/home");
  });

  it("extracts dynamic segment params and passes them to the component", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "7", title: "Buy milk", done: false, createdAt: Date.now() }
    });

    router.navigate("/detail/7");

    expect(store.getState().params).toEqual({ id: "7" });
    const app = document.getElementById("app");
    expect(app.textContent).toContain("Buy milk");
  });

  it("renders a not-found section for unregistered routes", () => {
    router.navigate("/does-not-exist");

    const app = document.getElementById("app");
    expect(app.querySelector(".not-found")).not.toBeNull();
  });
});
