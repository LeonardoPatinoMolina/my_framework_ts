import { PruevaComponent } from "../../components/prueva";
import { MyModule } from "../../lib/my_framework/decorators/myModule";
import { AboutComponent } from "./about.component";

@MyModule({
  nodes: [PruevaComponent],
  rootNode: AboutComponent
})
export class AboutModule{

}