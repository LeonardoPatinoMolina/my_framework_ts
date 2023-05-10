import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/myComponent";

@MyNode({selector: 'my-color'})
export class ColoresComponent extends MyComponent{
  build(): string {
    return super.template((_)=>`
      <div style="background-color: ${this.props?.color};">
      colores
      </div>
    `)
  }
}