import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "../../lib/my_framework/router/myRouter";

@MyNode({selector: 'my-counter'})
export class CounterComponent extends MyComponent {
  
  numero: number = 0
  color: string = 'blue'
  increment = () =>{
    this.refresh(()=>{
      this.numero++;
    })
  }
  
  decrement = () =>{
    this.refresh(()=>{
      this.numero--;
    })
  }
  
  build(): string {
    const validate = this.numero > 3;
  return this.template((_)=> `
    <main>
      counter works! hola mundo
      <div>
        ${this.numero}
      </div>
      <button ${_.on('click',this.increment)}>
        add
      </button>
      <button ${_.on('click',this.decrement)}>
        Sub
      </button>
      <br>
      <button ${_.on('click',()=>{MyRouter.go('/about')})}>
        navigate to about
      </button>
        ${_.child['my-color']({props: {color: 'blue', amount: this.numero}})}
      </main>
    `);
  }
}