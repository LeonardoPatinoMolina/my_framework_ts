import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";

@MyNode({selector: 'my-color'})
export class ColoresComponent extends MyComponent{
  
  build(): string {
    return this.template((_)=>`
      <div style="background-color: ${this.props?.color};">
        colores 
        <p ${_.myMul(this.props?.amount ?? 1)}>joder</p>
      </div>
    `)
  }
}
        // <input name="uno" type="text" placeholder="color" ${_.inputController('model','uno')}>
