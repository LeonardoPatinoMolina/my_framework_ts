import { MyModule } from "../../decorators/myModule";
import { _404Component } from "./404.component";

@MyModule({
  rootNode: _404Component,
  nodes:[]
})
export class _404Module{}