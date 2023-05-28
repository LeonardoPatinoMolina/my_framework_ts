import { MyModule } from "../../decorators/myModule";
import { _404Component } from "./404";

@MyModule({
  key: 'not-found-template-00',
  name: 'Page Not Found',
  rootNode: _404Component,
  nodes:[]
})
export class _404Module{}