import { MyDOM } from "@my_framework/core/myDOM";
import { store } from "./context/store";
import { MyRouter } from "./lib/my_framework/router/myRouter";
import { ROUTES } from "./pages/routes";

MyDOM.setGlobalStore(store);

const root = MyDOM.createRoot(document.getElementById('root'));
// root.render(CounterModule);

new MyRouter({
  routes: ROUTES
})