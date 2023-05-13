import { MyComponent } from "../lib/my_framework/core/myComponent";
import { MyNode } from "../lib/my_framework/decorators/myNode";
import { HolaService } from "../services/Hola";
import { ColoresComponent } from "./colores";

@MyNode({selector:'my-prueva', children: [ColoresComponent], services: [HolaService]})
export class PruevaComponent extends MyComponent{
  

  show: boolean = false;
  inputModel: any = {
    form: {
      field1: 'pla'
    }
  };

  epa = ()=>{
    this.refresh(()=>{
      this.show = !this.show
    })
  }
  build(): string {

    return super.template((_)=>`
    <div>
      lorem   
      <button ${_.on('click',this.epa)}>Toggle</button>
      <span ${_.myIf(this.show)}>jajai</span>
      <span ${_.myIf(!this.show)}>jojou</span>
    </div>
    `)
  }
}