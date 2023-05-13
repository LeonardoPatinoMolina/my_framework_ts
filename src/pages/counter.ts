import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "@my_framework/router/myRouter";
import { ColoresComponent } from "../components/colores";
import { PruevaComponent } from "../components/prueva";
import { HolaService } from "../services/Hola";


@MyNode({
  selector: 'my-counter',
  children: [
    PruevaComponent,
    ColoresComponent
  ],
  services: [HolaService]
})
export class CounterComponent extends MyComponent {
  
  numero = 0;

  saludo: HolaService;

  constructor(svc: any){
    super()
    console.log(svc);
    this.saludo = svc.saludo;
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

  changeM=()=>{
    this.saludo.cambiarSaludo(`${this.numero}`)
  }

  saludar=() =>{
    this.saludo.saludar();
  }
  
  build(): string {
  //  const colores = Array.from({length: this.numero}).map((_,i)=>({
  //    key: `color-${i}`,
  //    props: {
  //      color: '#2332'+(i+10)
  //    }}))
  return this.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${this.numero}
        <br>
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
      <br>
      <button ${_.on('click',this.changeM)}>Cambiar SALUDO</button>
      <button ${_.on('click',this.saludar)}>SALUDAR</button>
      <button ${_.on('click',()=>{MyRouter.go('/about')})}>navigate to about</button>
      ${_.child['my-prueva']()}
      </div>`
    );
  }
}