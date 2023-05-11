import { MyNode } from "@my_framework/decorators";
import { MyComponent } from "@my_framework/myComponent";
import { AboutComponent } from "./about";
import { ColoresComponent } from "./colores";
import { PruevaComponent } from "./prueva";

@MyNode({
  selector: 'my-counter',
  children: [
    PruevaComponent,
    AboutComponent,
    ColoresComponent
  ]
})
export class Counter extends MyComponent {
  
  numero = 0;
  
  ready(): void {
    console.log(this.numero);
  }

  increment = () =>{
    this.update(()=>{
      this.numero += 1
    })
  }

  decrement = () =>{
    this.update(()=>{
      this.numero -= 1
    })
  }
  
  build(): string {
   const colores = Array.from({length: this.numero}).map((c,i)=>({
     key: `color-${i}`,
     props: {
       color: '#2332'+(i+10)
     }}))

  return this.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${this.numero}
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
        ${_.child['my-color']({props: {color: 'red'}})}
        ${_.children['my-color'](colores)}
      </div>`
    );
  }
}