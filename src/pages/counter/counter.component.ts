import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "../../lib/my_framework/router/myRouter";

@MyNode({selector: 'my-counter',styles: '.hola{background-color: #f00} '})
export class CounterComponent extends MyComponent {
  
  numero: number = 0;

  init(): void {
    console.log('count');
    
  }
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
    
    return this.template((_)=> `
      <main id="hola" class="${this.numero < -2 && 'hola'}">
        counter works! hola mundo
        <br>
        <div>${this.numero}</div>
        <button ${_.on('click',this.increment)}>add</button>
        <button ${_.on('click',this.decrement)}>Sub</button>
        <button ${_.on('click',()=>{MyRouter.go('/about')})}>
          navigate to about
        </button>
        ${this.numero < -2 && _.child['my-prueva']({props:{children: _.child['my-color']()}})}
      </main>
    `);
  }
}