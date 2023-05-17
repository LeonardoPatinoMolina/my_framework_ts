import { MyComponent } from "@my_framework/core/myComponent";
import { InputModelI } from "@my_framework/core/types/inputController.types";
import { MyNode } from "@my_framework/decorators/myNode";

@MyNode({selector: 'my-color'})
export class ColoresComponent extends MyComponent{

  inputModel: InputModelI = {
    model: {
      uno: '',
    }
  };
  
  ready(): void {
    console.log('color');
    
  }
  build(): string {
    return this.template((_)=>`
      <div style="background-color: ${this.props?.color};">
        colores <p ${_.on('click',()=>{})}>joder</p>
        <input name="uno" type="text" placeholder="color" ${_.inputController('model','uno')}>
      </div>
    `)
  }
}