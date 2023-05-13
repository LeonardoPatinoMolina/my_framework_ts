import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { InputModelI } from "@my_framework/types/inputController.types";
import { setUserDispatch } from "../context/feature/user";

@MyNode({selector: 'my-color'})
export class ColoresComponent extends MyComponent{

  inputModel: InputModelI = {
    model: {
      uno: '',
      jorro: ''
    }
  };
  
  changeGlobal = () => {
    setUserDispatch(this.inputModel?.model.uno);
  }

  build(): string {
    return this.template((_)=>`
      <div style="background-color: ${this.props?.color};">
        colores <p ${_.on('click',this.changeGlobal)}>joder</p>
        <input name="uno" type="text" placeholder="color" ${_.inputController('model','uno')}>
        <input name="uno" type="text" placeholder="color" ${_.inputController('model','jorro')}>
      </div>
    `)
  }
}