import { MyNode } from "@my_framework/decorators/decorators";
import { MyComponent } from "@my_framework/myComponent";
import { MyGlobalStore } from "@my_framework/myGlobalStore";
import { MyRouter } from "@my_framework/myRouter";
import { ObserverI } from "@my_framework/types/myGlobalStore.types";
import { ColoresComponent } from "../components/colores";
import { PruevaComponent } from "../components/prueva";

@MyNode({
  selector: 'my-counter',
  children: [
    PruevaComponent,
    ColoresComponent
  ]
})
export class CounterComponent extends MyComponent implements ObserverI {
  
  epale: string[] = MyGlobalStore.subscribe('user',this);
  numero = 0;
  
  storeNotify(): void {
    this.refresh()
  }

  destroy(): void {
    MyGlobalStore.unSubscribe('user',this);
  }
  
  increment = () =>{
    this.refresh(()=>{
      this.numero += 1
    })
  }

  decrement = () =>{
    this.refresh(()=>{
      this.numero -= 1
    })
  }
  
  build(): string {
   const colores = Array.from({length: this.numero}).map((_,i)=>({
     key: `color-${i}`,
     props: {
       color: '#2332'+(i+10)
     }}))

  return this.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${this.numero}
        <br>
        ${this.epale}
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
      <button ${_.on('click',()=>{MyRouter.go('/about')})}>navigate to about</button>
        ${_.child['my-color']({props: {color: 'red'}})}
        ${_.children['my-color'](colores)}
      </div>`
    );
  }
}