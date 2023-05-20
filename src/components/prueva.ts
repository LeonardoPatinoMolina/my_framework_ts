import { MyComponent } from "../lib/my_framework/core/myComponent";
import { MyNode } from "../lib/my_framework/decorators/myNode";

@MyNode({selector:'my-prueva'})
export class PruevaComponent extends MyComponent{
  
  show: boolean = false;

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
      ${this.props?.children}
      </div>
    `)
  }
}