import { renderDetailPage } from "./pages/detail.js";
import { renderHomePage } from "./pages/home.js";
import { renderListPage } from "./pages/list.js";
import { renderSettingsPage } from "./pages/settings.js";

export function createRouter(store) {
  const routes = {};

  function register(path, component) {
    routes[path] = component;
  }

  function navigate(path) {
    store.dispatch({
      type: "NAVIGATE",
      payload: path
    });

    const component = routes[path];

    if (!component) {
      return;
    }

    const parts = path.split("/");

    let element;

    if (parts[1] === "detail") {
      const id = parts[parts.length - 1];
      element = component({ id });
    } else {
      element = component();
    }

    document.getElementById("app").replaceChildren(element);

    history.pushState({}, "", path);
  }

  window.addEventListener("popstate", () => {
    navigate(window.location.pathname);
  });

  return {
    register,
    navigate
  };
}