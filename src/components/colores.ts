import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/myComponent";
@MyNode({selector: 'my-color'})
export class Colores extends MyComponent{
  build(): string {
    return super.template((_)=>`
      <div style="background-color: blue;">
      colores
      </div>
    `)
  }
}