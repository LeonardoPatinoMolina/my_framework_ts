import { Counter } from "./components/counter";
import { MyDOM } from "./lib/my_framework/myDOM";

const root = MyDOM.createRoot(document.getElementById('root'));

root.render(Counter);

