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

// function sum(a, b) {
//   return a + b;
// }

// const handler = {
//   apply: function(target, thisArg, argumentsList) {
//     console.log(`Calculate sum: ${argumentsList}`);
//     // Expected output: "Calculate sum: 1,2"

//     return target(argumentsList[0], argumentsList[1]) * 10;
//   }
// };

// const proxy1 = new Proxy(sum, handler);

// console.log(sum(1, 2));
// // Expected output: 3
// console.log(proxy1(1, 2));
// // Expected output: 30
