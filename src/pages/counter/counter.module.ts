import { ColoresComponent } from "../../components/colores";
import { ModalComponent } from "../../components/modal";
import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { HttpService } from "../../services/http";
import { CounterComponent } from "./counter";

@MyModule({
  key: 'counter_module',
  nodes: [ModalComponent, ColoresComponent],
  rootNode: CounterComponent,
  services: [HttpService],
})
export class CounterModule {}