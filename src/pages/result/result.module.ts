import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { ResultComponent } from "./result";

@MyModule({
  key: 'result_module',
  name: 'Resultado',
  rootNode: ResultComponent,
  nodes: []
})
export class ResultModule{}