import { MyDOM } from "@my_framework/core/myDOM";
import { MyRouter } from "@my_framework/router/myRouter";
import { store } from "./context/store";
import { _404Component } from "./pages/404";
import { ROUTES } from "./pages/routes";


MyDOM.createRoot(document.getElementById('root'));
MyDOM.setGlobalStore(store);

new MyRouter({
  notFound: _404Component,
  routes: ROUTES
})