import { MyNode } from "../lib/my_framework/decorators";
import { MyComponent } from "../lib/my_framework/mycomponent";
import { Prueva } from "./prueva";

@MyNode({
  children: [{component: Prueva, selector: 'prueva'}]
})
export class Counter extends MyComponent {
  
  init(): void {
    this.state={
      count: 0
    }
  }
  

 build(): string {
    
  return super.template((_)=> `
    <div>
      counter works! hola mindo
      <div ${_.on('click',()=>{
      })}>
        ${this.state.count}
      </div>
      <button ${_.on('click',()=>this.update(()=>this.state.count += 1))}>add</button>
      <button ${_.on('click',()=>this.update(()=>this.state.count -= 1))}>Sub</button>
      
      <div ${_.myIf(this.state.count > 2)}>
        ${_.children['prueva']()}
      </div>
    </div>`);
  }
}
