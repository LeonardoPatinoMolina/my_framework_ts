import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/myComponent";
import { ColoresComponent } from "./colores";

@MyNode({selector:'my-prueva', children: [ColoresComponent]})
export class PruevaComponent extends MyComponent{

  init(): void {
    this.state = {
      show: true,
      form: {
        field1: 'placeholder'
      }
    }
  }
  ready(): void {
    console.log('hijo');
    
  }
  build(): string {

    const epa = ()=>{
      this.update(()=>{
        this.state.show = !this.state.show
    })
  }
    return super.template((_)=>`
    <div>
      lorem   
      <button ${_.on('click',epa)}>Toggle</button>
      <span ${_.myIf(this.state.show)}>jajai</span>
      <span ${_.myIf(!this.state.show)}>jojou</span>

      <input type="text" ${_.inputController('form','field1')}>
      ${this.props?.sabor}
      ${_.child['my-color']({props: {color: '#f1f2f1'}})}
    </div>
    `)
  }
}