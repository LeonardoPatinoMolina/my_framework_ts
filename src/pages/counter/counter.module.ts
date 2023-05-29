import { ColoresComponent } from "../../components/colores";
import { ModalComponent } from "../../components/modal";
import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { HttpService } from "../../services/http";
import { _404Module } from "../404/404.module";
import { CounterComponent } from "./counter";

@MyModule({
  key: 'counter_module',
  name: 'Contador',
  nodes: [ModalComponent, ColoresComponent],
  rootNode: CounterComponent,
  services: [HttpService],
  modules: [_404Module]
})
export class CounterModule {}