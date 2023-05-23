import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { ResultComponent } from "./result";

@MyModule({
  rootNode: ResultComponent,
  nodes: []
})
export class ResultModule{}