import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/mycomponent";

@MyNode()
export class Prueva extends MyComponent{

  init(): void {
    this.state = {
      show: true,
      form: {
        field1: 'lorem'
      }
    }
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

      <input type="text" ${_.inputController('form','field1',(k: string)=>{
        console.log(k);
        return k
      })}>
      ${this.props?.sabor}
    </div>
    `)
  }
}