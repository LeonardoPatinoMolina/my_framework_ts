import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/mycomponent";

@MyNode()
export class Colores extends MyComponent{
  build(): string {
    return super.template((_)=>`
      <div style="background-color: blue;">
      colores
      </div>
    `)
  }
}