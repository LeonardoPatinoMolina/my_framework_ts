import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { _404Component1 } from "./404";

@MyModule({
  key: '404_module',
  name: '404 de prueva',
  rootNode: _404Component1,
  nodes:[]
})
export class _404Module{}