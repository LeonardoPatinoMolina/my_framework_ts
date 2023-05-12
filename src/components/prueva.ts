import { MyNode } from "../lib/my_framework/decorators/decorators";
import { MyComponent } from "../lib/my_framework/myComponent";
import { ColoresComponent } from "./colores";

@MyNode({selector:'my-prueva', children: [ColoresComponent]})
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

      <input type="text" ${_.inputController('form','field1')}>
      ${this.props?.sabor}
      ${_.child['my-color']({props: {color: '#f1f2f1'}})}
    </div>
    `)
  }
}