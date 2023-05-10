import { MyNode } from "@my_framework/decorators";
import { MyComponent } from "@my_framework/myComponent";
import { Colores } from "./colores";
import { Prueva } from "./prueva";

@MyNode({
  selector: 'my-counter',
  children: [
    {component: Prueva},
    {component: Colores},
  ]
})
export class Counter extends MyComponent {
  
  init(): void {
    this.state={
      count: 0
    }
  }
  ready(): void {
    console.log('padre');
    
  }

 build(): string {
  
  return super.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol" ${_.on('click',()=>{
      })}>
        ${this.state.count}
      </div>
      <button ${_.on('click',()=>this.update(()=>this.state.count += 1))}>add</button>
      <button ${_.on('click',()=>this.update(()=>this.state.count -= 1))}>Sub</button>
      ${_.child['my-prueva']()}
      </div>`
    );
  }
}
