import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { _404Component } from "./404";

@MyModule({
  key: '404_module',
  rootNode: _404Component,
  nodes:[]
})
export class _404Module{}