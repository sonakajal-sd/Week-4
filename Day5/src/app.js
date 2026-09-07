
import { createRouter } from "./router.js";

import { createStore, reducer } from "./store.js";

import { renderHomePage } from "./pages/home.js";
import { renderListPage } from "./pages/list.js";
import { renderSettingsPage } from "./pages/settings.js";

const store = createStore(
  {
    route: "/home",
    items: []
  },
  reducer
);

const router = createRouter(store);

router.register("/home", renderHomePage);
router.register("/list", renderListPage);
router.register("/settings", renderSettingsPage);

router.navigate("/home");

