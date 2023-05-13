import { MyDOM } from "@my_framework/core/myDOM";
import { MyRouter } from "@my_framework/router/myRouter";
import { ColoresComponent } from "./components/colores";
import { store } from "./context/store";
import { ROUTES } from "./pages/routes";

MyDOM.createRoot(document.getElementById('root'));
MyDOM.setGlobalStore(store);

new MyRouter({
  notFound: ColoresComponent,
  routes: ROUTES
})
