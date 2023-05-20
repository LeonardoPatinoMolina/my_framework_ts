import { ColoresComponent } from "../../components/colores";
import { PruevaComponent } from "../../components/prueva";
import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { HttpService } from "../../services/http";
import { CounterComponent } from "./counter.component";

@MyModule({
  nodes: [PruevaComponent, ColoresComponent],
  rootNode: CounterComponent,
  services: [HttpService]
})
export class CounterModule {}