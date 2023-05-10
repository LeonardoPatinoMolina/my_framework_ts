import { MyNode } from "@my_framework/decorators";
import { MyComponent } from "@my_framework/myComponent";
import { AboutComponent } from "./about";
import { PruevaComponent } from "./prueva";

@MyNode({
  selector: 'my-counter',
  children: [
    PruevaComponent,
    AboutComponent
  ]
})
export class Counter extends MyComponent {
  
  init(): void {
    this.state={
      count: 0,
    }
  }
  ready(): void {
    console.log('padre');
  }

  increment = () =>{
    this.update(()=>{
      this.state.count += 1
    })
  }
  decrement = () =>{
    this.update(()=>{
      this.state.count -= 1
    })
  }

  
  build(): string {
   const colores = Array.from({length: this.state.count}).map((c,i)=>({
     key: `color${i}`,
     props: {
       color: '#2332'+(i+10)
     }}))
  const {count} = this.state
  return super.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${count}
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
        ${_.children['my-prueva'](colores)}
      </div>`
    );
  }
}