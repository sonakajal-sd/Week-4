export function matchPath(routePath, actualPath) {
  const routeParts = routePath.split("/").filter(Boolean);
  const actualParts = actualPath.split("/").filter(Boolean);

  if (routeParts.length !== actualParts.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const actualPart = actualParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(actualPart);
    } else if (routePart !== actualPart) {
      return null;
    }
  }

  return params;
}

export function createRouter(store, rootId = "app") {
  const routes = [];
  let currentPath = null;

  function register(path, component) {
    routes.push({ path, component });
  }

  function findMatch(path) {
    const cleanPath = (path.split("?")[0].split("#")[0]) || "/";

    for (const route of routes) {
      const params = matchPath(route.path, cleanPath);
      if (params) {
        return { route, params };
      }
    }

    return null;
  }

  function renderNotFound(path) {
    const section = document.createElement("section");
    section.className = "page not-found";
    section.textContent = `No route matches "${path}"`;
    return section;
  }

  function render() {
    if (currentPath === null) {
      return;
    }

    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const matched = findMatch(currentPath);

    if (!matched) {
      root.replaceChildren(renderNotFound(currentPath));
      return;
    }

    const element = matched.route.component({
      state: store.getState(),
      store,
      navigate,
      params: matched.params
    });

    element.classList.add("page-transition");
    root.replaceChildren(element);
  }

  function navigate(path, { push = true } = {}) {
    currentPath = path;
    const matched = findMatch(path);

    if (push) {
      history.pushState({}, "", path);
    }

    store.dispatch({
      type: "NAVIGATE",
      payload: {
        path,
        params: matched ? matched.params : {}
      }
    });
  }

  store.subscribe(() => render());

  window.addEventListener("popstate", () => {
    navigate(window.location.pathname, { push: false });
  });

  return { register, navigate, matchPath: findMatch };
}
