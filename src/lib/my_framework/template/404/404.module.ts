import { MyModule } from "../../decorators/myModule";
import { _404Component } from "./404";

@MyModule({
  key: 'not-found-template-00',
  rootNode: _404Component,
  nodes:[]
})
export class _404Module{}